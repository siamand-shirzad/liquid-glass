import React, { useMemo } from "react";
import { motion, useTransform, MotionValue } from "motion/react";

// ایمپورت توابع ریاضی (مطمئن شوید پوشه lib کامل است)
import { calculateDisplacementMap, calculateDisplacementMap2 } from "../lib/displacementMap";
import { calculateMagnifyingDisplacementMap } from "../lib/magnifyingDisplacement";
import { calculateRefractionSpecular } from "../lib/specular";
import { CONVEX, SURFACE_TYPES } from "../lib/surfaceEquations"; // این فایل را در مرحله بعد آپدیت می‌کنیم

// تابع کمکی برای تبدیل داده به عکس
function imageDataToDataUrl(imageData: ImageData): string {
  if (typeof document === "undefined") return ""; // چک کردن محیط سرور
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
  // نوع لبه شیشه (محدب، مقعر، لب‌دار)
  bezelType?: "convex_squircle" | "convex" | "concave" | "lip";
  
  // انیمیشن‌ها
  blur?: number | MotionValue<number>;
  scaleRatio?: number | MotionValue<number>;
  specularOpacity?: number | MotionValue<number>;
  specularSaturation?: number | MotionValue<number>;
  magnifyingScale?: number | MotionValue<number>; // اختیاری شد
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
  magnifyingScale, // اگر پاس داده نشود، undefined است
}) => {
  
  const { dispUrl, specUrl, magUrl, maxDisplacement } = useMemo(() => {
    // ۱. انتخاب فرمول ریاضی بر اساس نوع لبه
    const surfaceDef = SURFACE_TYPES[bezelType] || CONVEX;
    const surfaceFn = surfaceDef.fn;

    // ۲. محاسبه شکست نور بدنه
    const precomputed = calculateDisplacementMap(
      glassThickness, bezelWidth, surfaceFn, refractiveIndex
    );
    const maxDisp = Math.max(...precomputed.map((x) => Math.abs(x)));
    
    const dispData = calculateDisplacementMap2(
      width, height, width, height, radius, bezelWidth, 100, precomputed, window.devicePixelRatio || 1
    );

    // ۳. محاسبه برق شیشه
    const specData = calculateRefractionSpecular(
      width, height, radius, bezelWidth, undefined, window.devicePixelRatio || 1
    );

    // ۴. محاسبه بزرگ‌نمایی (فقط اگر نیاز بود)
    // برای دکمه‌های ساده مثل Switch، این محاسبه انجام نمی‌شود تا سبک باشد
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

  // تبدیل متغیرهای Motion
  const displacementScale = useTransform(() => {
    const ratio = typeof scaleRatio === "number" ? scaleRatio : scaleRatio.get();
    return maxDisplacement * ratio;
  });

  const specularSatStr = useTransform(() =>
    (typeof specularSaturation === "number" ? specularSaturation : specularSaturation.get()).toString()
  );

  return (
    <svg style={{ display: "none" }}>
      <defs>
        <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
          
          {/* لایه ۱: بزرگ‌نمایی (فقط اگر magnifyingScale وجود داشته باشد) */}
          {magnifyingScale && magUrl && (
            <>
              <feImage href={magUrl} result="magMap" x="0" y="0" width={width} height={height} />
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

          {/* لایه ۲: بلور */}
          <motion.feGaussianBlur
            // اگر لایه بزرگ‌نمایی داشتیم، روی آن بلور بزن، وگرنه روی تصویر اصلی
            in={magnifyingScale ? "magnified" : "SourceGraphic"}
            stdDeviation={blur}
            result="blurred"
          />

          {/* لایه ۳: شکست نور بدنه (شکل هندسی دکمه) */}
          <feImage href={dispUrl} result="dispMap" x="0" y="0" width={width} height={height} />
          <motion.feDisplacementMap
            in="blurred"
            in2="dispMap"
            scale={displacementScale}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          {/* لایه ۴: تنظیم رنگ و اشباع */}
          <motion.feColorMatrix
            in="displaced"
            type="saturate"
            values={specularSatStr}
            result="saturated"
          />

          {/* لایه ۵: بازتاب نور (برق شیشه) */}
          <feImage href={specUrl} result="specLayer" x="0" y="0" width={width} height={height} />
          
          <feComposite in="saturated" in2="specLayer" operator="in" result="specComp" />
          
          <feComponentTransfer in="specLayer" result="specFaded">
            <motion.feFuncA type="linear" slope={specularOpacity} />
          </feComponentTransfer>

          {/* ترکیب نهایی */}
          <feBlend in="specComp" in2="displaced" mode="normal" result="blended1" />
          <feBlend in="specFaded" in2="blended1" mode="normal" />

        </filter>
      </defs>
    </svg>
  );
};