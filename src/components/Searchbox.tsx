import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useEffect, useRef } from "react";
import { Filter } from "./Filter";

export const Searchbox: React.FC = () => {
  const height = 56;
  const width = 420;
  const radius = height / 2;

  const specularOpacity = useMotionValue(0.2);
  const specularSaturation = useMotionValue(4);
  const refractionLevel = useMotionValue(0.7);
  // بلور را کمی بیشتر کنید تا در حالت عادی محو باشد
  const blur = useMotionValue(1); 
  const focused = useMotionValue(0);
  const pointerDown = useMotionValue(0);

  // --- سایه ---
  const shadowOpacity = useSpring(useTransform(focused, [0, 1], [0.12, 0.25]), { damping: 50, stiffness: 300 });
  const shadowY = useSpring(useTransform(focused, [0, 1], [4, 16]), { damping: 50, stiffness: 300 });
  const shadowBlur = useSpring(useTransform(focused, [0, 1], [10, 30]), { damping: 50, stiffness: 300 });

  const boxShadow = useTransform(
    [shadowY, shadowBlur, shadowOpacity],
    ([y, b, o]) => `0 ${y}px ${b}px rgba(0, 0, 0, ${o})`
  );

  const backgroundOpacity = useSpring(
    useTransform([pointerDown, focused], ([p, f]) => Math.max(p * 0.3, f * 0.2, 0.05)),
    { damping: 110, stiffness: 2000 }
  );

  // --- انیمیشن اصلاح شده Scale ---
  const scale = useSpring(
    useTransform(() => {
      const pd = pointerDown.get();
      const f = focused.get();
      // منطق نرم‌تر: از 0.95 به 1 می‌رود
      return (f ? 1 : 0.9) * (pd ? 0.99 : 1);
    }),
    // تنظیمات فیزیکی مشابه فایل MixedUI.tsx
    { damping: 34, stiffness: 800 }
  );

  // --- اتصال بلور به فوکوس (اختیاری ولی زیبا) ---
  // وقتی فوکوس نیست، محتوای پشت کمی تارتر دیده شود
  useEffect(() => {
    const unsubscribe = focused.on("change", (v) => {
       // اگر فوکوس شد، بلور 0 شود، اگر نبود 2
       blur.set(v ? 2 : 1);
    });
    return () => unsubscribe();
  }, [blur, focused]);

  useEffect(() => {
    const onPointerUp = () => pointerDown.set(0);
    window.addEventListener("pointerup", onPointerUp);
    return () => window.removeEventListener("pointerup", onPointerUp);
  }, [pointerDown]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="fixed top-2/3 flex justify-center items-center z-50">
      <motion.div
        className="relative"
        style={{ width, height, borderRadius: radius, scale }}
        onMouseDown={() => pointerDown.set(1)}
        onClick={() => inputRef.current?.focus()}
      >
        <Filter
          id="searchbox-filter"
          width={420}
          height={56}
          radius={28} // اصلاح شد به 28 (نصف 56)
          bezelWidth={27}
          glassThickness={60}
          refractiveIndex={2} // کمی طبیعی‌تر (1.5) بهتر از 2 است برای این سایز
          bezelType="convex_squircle"
          
          blur={blur}
          scaleRatio={refractionLevel}
          specularOpacity={specularOpacity}
          specularSaturation={specularSaturation}
        />

        <motion.div
          className="absolute inset-0 ring-1 ring-black/5"
          style={{
            borderRadius: radius,
            backdropFilter: `url(#searchbox-filter)`,
            backgroundColor: useTransform(backgroundOpacity, (a) => `rgba(255, 255, 255, ${a})`),
            boxShadow: boxShadow,
          }}
        />

        <div
          className="absolute inset-0 flex items-center gap-3 px-5 text-black/80"
          style={{ borderRadius: radius, zIndex: 1 }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-50">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            ref={inputRef}
            type="search"
            placeholder="Search..."
            className="shrink-0 min-w-0 bg-transparent outline-none border-0 text-[15px] placeholder:text-black/40"
            onFocus={() => focused.set(1)}
            onBlur={() => focused.set(0)}
          />
        </div>
      </motion.div>
    </div>
  );
};