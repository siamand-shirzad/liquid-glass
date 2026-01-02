import React, { useMemo } from "react";
// اگر پکیج framer-motion دارید، خط زیر را تغییر دهید
import { motion, useTransform, MotionValue } from "motion/react"; 

import { calculateDisplacementMap, calculateDisplacementMap2 } from "../lib/displacementMap";
import { calculateMagnifyingDisplacementMap } from "../lib/magnifyingDisplacement";
import { calculateRefractionSpecular } from "../lib/specular";
import { CONVEX, SURFACE_TYPES } from "../lib/surfaceEquations";

// تابع کمکی تبدیل داده به عکس (بدون تغییر)
function imageDataToDataUrl(imageData: ImageData): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
  }
  return "";
}

interface FilterProps {
  id: string;
  width: number;
  height: number;
  radius: number;
  bezelWidth: number;
  glassThickness: number;
  refractiveIndex: number;
  bezelType?: "convex_squircle" | "convex" | "concave" | "lip";
  blur?: number | MotionValue<number>;
  scaleRatio?: number | MotionValue<number>;
  specularOpacity?: number | MotionValue<number>;
  specularSaturation?: number | MotionValue<number>;
  magnifyingScale?: number | MotionValue<number>;
}

export const Filter: React.FC<FilterProps> = ({
  id,
  width,
  height,
  radius,
  bezelWidth,
  glassThickness,
  refractiveIndex,
  bezelType = "convex_squircle",
  blur = 0,
  scaleRatio = 1,
  specularOpacity = 0.5,
  specularSaturation = 9,
  magnifyingScale,
}) => {
  
  const { dispUrl, specUrl, magUrl, maxDisplacement } = useMemo(() => {
    // گارد امنیتی: اگر window نبود (مثلا موقع بیلد یا تست)، مقدار خالی برگردان
    if (typeof window === 'undefined') {
        return { dispUrl: "", specUrl: "", magUrl: "", maxDisplacement: 0 };
    }

    const dpr = window.devicePixelRatio || 1;

    const surfaceDef = SURFACE_TYPES[bezelType] || CONVEX;
    const surfaceFn = surfaceDef.fn;

    // ۱. محاسبات ریاضی
    const precomputed = calculateDisplacementMap(
      glassThickness, bezelWidth, surfaceFn, refractiveIndex
    );
    const maxDisp = Math.max(...precomputed.map((x) => Math.abs(x)));
    
    // ۲. تولید مپ جابجایی
    const dispData = calculateDisplacementMap2(
      width, height, width, height, radius, bezelWidth, 100, precomputed, dpr
    );

    // ۳. تولید مپ براقیت (Specular)
    const specData = calculateRefractionSpecular(
      width, height, radius, bezelWidth, undefined, dpr
    );

    // ۴. تولید مپ ذره‌بین (فقط در صورت نیاز)
    let magDataUrl = "";
    if (magnifyingScale) {
        const magData = calculateMagnifyingDisplacementMap(width, height);
        magDataUrl = imageDataToDataUrl(magData);
    }

    return {
      dispUrl: imageDataToDataUrl(dispData),
      specUrl: imageDataToDataUrl(specData),
      magUrl: magDataUrl,
      maxDisplacement: maxDisp,
    };
  }, [width, height, radius, bezelWidth, glassThickness, refractiveIndex, bezelType, Boolean(magnifyingScale)]);

  // تبدیل MotionValue ها
  const displacementScale = useTransform(() => {
    const ratio = typeof scaleRatio === "number" ? scaleRatio : scaleRatio.get();
    return maxDisplacement * ratio;
  });

  const specularSatStr = useTransform(() =>
    (typeof specularSaturation === "number" ? specularSaturation : specularSaturation.get()).toString()
  );

  // اگر هنوز دیتایی نداریم (مثلاً اولین رندر سمت کلاینت)، چیزی برنگردان
  if (!dispUrl) return null;

  return (
    <svg style={{ display: "none" }}>
      <defs>
        <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
          
          {/* لایه بزرگ‌نمایی */}
          {magnifyingScale && magUrl && (
            <>
              <feImage 
                href={magUrl} 
                result="magMap" 
                x="0" y="0" 
                width={width} height={height} 
                preserveAspectRatio="none" 
              />
              <motion.feDisplacementMap
                in="SourceGraphic"
                in2="magMap"
                scale={magnifyingScale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="magnified"
              />
            </>
          )}

          {/* لایه بلور */}
          <motion.feGaussianBlur
            in={magnifyingScale ? "magnified" : "SourceGraphic"}
            stdDeviation={blur}
            result="blurred"
          />

          {/* لایه اصلی شیشه (شکست نور) */}
          <feImage 
            href={dispUrl} 
            result="dispMap" 
            x="0" y="0" 
            width={width} height={height} 
            preserveAspectRatio="none" // این خط جلوی دفرمه شدن لبه‌ها را می‌گیرد
          />
          <motion.feDisplacementMap
            in="blurred"
            in2="dispMap"
            scale={displacementScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          {/* لایه رنگ و نور */}
          <motion.feColorMatrix
            in="displaced"
            type="saturate"
            values={specularSatStr}
            result="saturated"
          />

          {/* لایه براقیت */}
          <feImage 
            href={specUrl} 
            result="specLayer" 
            x="0" y="0" 
            width={width} height={height} 
            preserveAspectRatio="none"
          />
          
          <feComposite in="saturated" in2="specLayer" operator="in" result="specComp" />
          
          <feComponentTransfer in="specLayer" result="specFaded">
            <motion.feFuncA type="linear" slope={specularOpacity} />
          </feComponentTransfer>

          <feBlend in="specComp" in2="displaced" mode="normal" result="blended1" />
          <feBlend in="specFaded" in2="blended1" mode="normal" />

        </filter>
      </defs>
    </svg>
  );
};