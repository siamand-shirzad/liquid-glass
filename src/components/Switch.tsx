import { mix, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect, useRef } from "react";
import { Filter } from "./Filter";

export const Switch: React.FC = () => {
  const sliderHeight = 67;
  const sliderWidth = 160;
  const thumbWidth = 146;
  const thumbHeight = 92;
  const thumbRadius = thumbHeight / 2;
  
  // تنظیمات انیمیشن
  const blur = useMotionValue(0.2);
  const specularOpacity = useMotionValue(0.5);
  const specularSaturation = useMotionValue(6);
  const refractionBase = useMotionValue(1);
  
  const checked = useMotionValue(1); // 0 یا 1
  const xDragRatio = useMotionValue(0);
  const pointerDown = useMotionValue(0);

  const THUMB_REST_SCALE = 0.65;
  const THUMB_ACTIVE_SCALE = 0.9;
  const TRAVEL = sliderWidth - sliderHeight - (thumbWidth - thumbHeight) * THUMB_REST_SCALE;

  // فیزیک حرکت
  const active = useTransform(() => pointerDown.get() > 0.5 ? 1 : 0);
  
  const xRatio = useSpring(
    useTransform(() => pointerDown.get() > 0.5 ? xDragRatio.get() : (checked.get() ? 1 : 0)),
    { damping: 80, stiffness: 1000 }
  );

  const thumbScale = useSpring(
    useTransform(active, (v) => THUMB_REST_SCALE + (THUMB_ACTIVE_SCALE - THUMB_REST_SCALE) * v),
    { damping: 80, stiffness: 2000 }
  );

  const scaleRatio = useSpring(
    useTransform(() => (0.4 + 0.5 * active.get()) * refractionBase.get())
  );

  const backgroundColor = useTransform(
    useSpring(checked, { damping: 80, stiffness: 1000 }),
    mix("#94949F77", "#3BBF4EEE")
  );

  const sliderRef = useRef<HTMLDivElement>(null);
  const initialPointerX = useMotionValue(0);

  // هندلر کلیک و درگ
  useEffect(() => {
    const onPointerUp = (e: any) => {
      pointerDown.set(0);
      const x = e.clientX || e.changedTouches?.[0]?.clientX;
      if (Math.abs(x - initialPointerX.get()) > 4) {
         checked.set(xDragRatio.get() > 0.5 ? 1 : 0);
      }
    };
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, []);

  return (
    <div className="relative h-40 flex justify-center items-center">
      <motion.div
        ref={sliderRef}
        style={{
          width: sliderWidth, height: sliderHeight,
          backgroundColor, borderRadius: sliderHeight / 2,
          position: "relative", cursor: "pointer",
        }}
        onMouseMove={(e) => {
            if(pointerDown.get() === 0) return;
            const ratio = checked.get() + (e.clientX - initialPointerX.get()) / TRAVEL;
            xDragRatio.set(Math.min(1, Math.max(0, ratio)));
        }}
        onClick={(e) => {
            if (Math.abs(e.clientX - initialPointerX.get()) < 4) {
                checked.set(checked.get() === 1 ? 0 : 1);
            }
        }}
      >
        <Filter
            id="switch-filter"
            // --- تنظیمات فیزیکی دکمه سوئیچ ---
            width={146} height={92} radius={46}
            bezelWidth={19} glassThickness={47}
            bezelType="lip" // مدل لب‌دار
            refractiveIndex={1.5}
            // --- انیمیشن ---
            blur={blur}
            scaleRatio={scaleRatio}
            specularOpacity={specularOpacity}
            specularSaturation={specularSaturation}
        />

        <motion.div
          className="absolute"
          onMouseDown={(e) => { pointerDown.set(1); initialPointerX.set(e.clientX); }}
          style={{
            height: thumbHeight, width: thumbWidth,
            top: sliderHeight / 2, y: "-50%",
            borderRadius: thumbRadius,
            x: useTransform(() => 
               - ((1 - THUMB_REST_SCALE) * thumbWidth) / 2 + 
               (sliderHeight - thumbHeight * THUMB_REST_SCALE) / 2 + 
               xRatio.get() * TRAVEL
            ),
            scale: thumbScale,
            backdropFilter: `url(#switch-filter)`,
            backgroundColor: "rgba(255,255,255,0.1)",
            boxShadow: "0 4px 22px rgba(0,0,0,0.1)",
          }}
        />
      </motion.div>
    </div>
  );
};