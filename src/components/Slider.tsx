import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect, useRef } from "react";
// ایمپورت کامپوننت فیلتر خودمان
import { Filter } from "./Filter";

export const Slider: React.FC = () => {
  const min = 0;
  const max = 100;
  const value = useMotionValue(10);

  const sliderHeight = 14;
  const sliderWidth = 330;

  // متغیرهای وضعیت تعامل
  const pointerDown = useMotionValue(0);
  const forceActive = useMotionValue(false);

  const isUp = useTransform((): number =>
    forceActive.get() || pointerDown.get() > 0.5 ? 1 : 0
  );

  const thumbWidth = 90;
  const thumbHeight = 60;
  const thumbRadius = 30;
  
  // تنظیمات انیمیشن
  const blur = useMotionValue(0); 
  const specularOpacity = useMotionValue(0.4); 
  const specularSaturation = useMotionValue(7); 
  const refractionBase = useMotionValue(1); 
  
  const pressMultiplier = useTransform(isUp, [0, 1], [0.4, 0.9]);
  
  // توجه: اینجا اسم متغیر scaleRatio است
  const scaleRatio = useSpring(
    useTransform(
      [pressMultiplier, refractionBase],
      ([m, base]) => (Number(m) || 0) * (Number(base) || 0)
    )
  );

  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const SCALE_REST = 0.6;
  const SCALE_DRAG = 1;
  const thumbWidthRest = thumbWidth * SCALE_REST;

  const scaleSpring = useSpring(
    useTransform(isUp, [0, 1], [SCALE_REST, SCALE_DRAG]),
    { damping: 80, stiffness: 2000 }
  );

  const backgroundOpacity = useSpring(useTransform(isUp, [0, 1], [1, 0.1]), {
    damping: 80, stiffness: 2000,
  });

  useEffect(() => {
    function onPointerUp() { pointerDown.set(0); }
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, []);

  return (
    <div className="relative h-40 flex justify-center items-center select-none">
      <motion.div
        style={{ position: "relative", width: sliderWidth, height: thumbHeight }}
      >
        {/* نوار پشت اسلایدر */}
        <motion.div
          ref={trackRef}
          style={{
            display: "inline-block", width: sliderWidth, height: sliderHeight,
            left: 0, top: (thumbHeight - sliderHeight) / 2,
            backgroundColor: "#89898F66", borderRadius: sliderHeight / 2,
            position: "absolute", cursor: "pointer",
          }}
          onMouseDown={() => pointerDown.set(1)}
          onMouseUp={() => pointerDown.set(0)}
        >
          <div className="w-full h-full overflow-hidden rounded-full">
            <motion.div
              style={{
                top: 0, left: 0, height: sliderHeight,
                width: useTransform(value, (v) => `${v}%`),
                borderRadius: 6, backgroundColor: "#0377F7",
              }}
            />
          </div>
        </motion.div>

        {/* فیلتر شکست نور برای دستگیره */}
        <Filter
          id="thumb-filter-slider"
          // --- تنظیمات فیزیکی استخراج شده ---
          width={90}
          height={60}
          radius={30}
          bezelWidth={16}
          glassThickness={80}
          refractiveIndex={1.45}
          bezelType="convex_squircle"
          
          // --- انیمیشن‌ها ---
          blur={blur}
          scaleRatio={scaleRatio}
          specularOpacity={specularOpacity}
          specularSaturation={specularSaturation}
        />

        {/* دستگیره شیشه‌ای (Thumb) */}
        <motion.div
          ref={thumbRef}
          drag="x"
          dragConstraints={{
            left: -thumbWidthRest / 3,
            right: sliderWidth - thumbWidth + thumbWidthRest / 3,
          }}
          dragElastic={0.02}
          onMouseDown={() => pointerDown.set(1)}
          onMouseUp={() => pointerDown.set(0)}
          onDragStart={() => pointerDown.set(1)}
          onDrag={(_) => {
            if (!trackRef.current || !thumbRef.current) return;
            const track = trackRef.current.getBoundingClientRect();
            const thumb = thumbRef.current.getBoundingClientRect();
            const x0 = track.left + thumbWidthRest / 2;
            const x100 = track.right - thumbWidthRest / 2;
            const trackInsideWidth = x100 - x0;
            const thumbCenterX = thumb.left + thumb.width / 2;
            const x = Math.max(x0, Math.min(x100, thumbCenterX));
            const ratio = (x - x0) / trackInsideWidth;
            value.set(Math.max(min, Math.min(max, ratio * (max - min) + min)));
          }}
          onDragEnd={() => pointerDown.set(0)}
          dragMomentum={false}
          className="absolute ring-1 ring-black/5"
          style={{
            height: thumbHeight,
            width: thumbWidth,
            top: 0,
            borderRadius: thumbRadius,
            // اعمال فیلتر
            backdropFilter: `url(#thumb-filter-slider)`,
            scale: scaleSpring,
            cursor: "pointer",
            backgroundColor: useTransform(
              backgroundOpacity,
              (op) => `rgba(255, 255, 255, ${op})`
            ),
            boxShadow: "0 3px 14px rgba(0,0,0,0.1)",
          }}
        />
      </motion.div>
    </div>
  );
};