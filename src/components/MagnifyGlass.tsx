import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import React, { useEffect, useRef } from 'react';
import { Filter } from './Filter';

export const MagnifyingGlass: React.FC = ({}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // متغیرهای حرکتی برای وضعیت درگ و سرعت
  const isDragging = useMotionValue(false);
  const velocityX = useMotionValue(0);

  // ابعاد لنز
  const width = 210;
  const height = 150;
  const radius = height / 2;

  // --- کنترل‌های انیمیشن (Motion Values) ---

  // ۱. افکت بزرگ‌نمایی (Scale) هنگام درگ کردن
  // وقتی درگ می‌کنید، عدد بزرگ‌نمایی از ۲۴ به ۴۸ تغییر می‌کند (انیمیشن فنری)
const magnifyingScale = useSpring(24, { stiffness: 250, damping: 14 });

// ۲. آپدیت کردن اسپرینگ در useEffect
useEffect(() => {
   // سابسکرایب کردن به تغییرات isDragging
   const unsubscribe = isDragging.on("change", (latest) => {
     magnifyingScale.set(latest ? 48 : 24);
   });
   return unsubscribe;
}, []);
  // ۲. تغییر اندازه خود شیشه (Object Scale)
  // وقتی درگ می‌کنید، شیشه کمی بزرگ‌تر می‌شود (۱) و وقتی رهاست (۰.۸)
  const objectScale = useSpring(
    useTransform(isDragging, (d): number => (d ? 1 : 0.8)),
    { stiffness: 340, damping: 20 }
  );

  // ۳. انیمیشن "له شدن" (Squish) بر اساس سرعت حرکت
  // وقتی سریع حرکت می‌دهید، شیشه در جهت حرکت کشیده و در جهت مخالف فشرده می‌شود
  const objectScaleY = useSpring(
    useTransform((): number => objectScale.get() * Math.max(0.7, 1 - Math.abs(velocityX.get()) / 5000)),
    { stiffness: 340, damping: 30 }
  );
  // حفظ حجم: اگر Y کم شد، X زیاد می‌شود
  const objectScaleX = useSpring(
    useTransform((): number => objectScale.get() + (1 - objectScaleY.get())),
    { stiffness: 340, damping: 30 }
  );

  // ۴. سایه‌های پویا (Dynamic Shadows)
  // سایه‌ها هنگام بلند کردن (درگ) عمیق‌تر و بلورتر می‌شوند
  const shadowBlur = useSpring(
    useTransform(isDragging, (d): number => (d ? 24 : 9)),
    { stiffness: 340, damping: 30 }
  );
  // ترکیب سایه‌ها در یک متغیر برای استایل
  const boxShadow = useTransform(
    () => `0px ${isDragging.get() ? 16 : 4}px ${shadowBlur.get()}px rgba(0,0,0,0.2)`
    // (خلاصه شده برای خوانایی)
  );

  // هندلر برای پایان درگ (چون رویدادهای ماوس ممکن است خارج از المنت رخ دهند)
  useEffect(() => {
    const handleUp = () => isDragging.set(false);
    window.addEventListener('pointerup', handleUp);
    return () => window.removeEventListener('pointerup', handleUp);
  }, [isDragging]);

  return (
    <>
      <div ref={containerRef} className="   ">

        {/* المان قابل درگ (خود شیشه) */}
        <motion.div
          className="absolute top-6 left-6 z-10 cursor-grab active:cursor-grabbing"
          style={{
            width,
            height,
            borderRadius: radius,
            scaleX: objectScaleX, // اتصال انیمیشن له شدن
            scaleY: objectScaleY
          }}
          drag
          dragConstraints={containerRef} // محدود به کادر
          onDrag={(_, info) => velocityX.set(info.velocity.x)} // دریافت سرعت برای افکت
          onMouseDown={() => isDragging.set(true)}>
          {/* تعریف فیلتر SVG:
             این کامپوننت فیلتر را در DOM می‌سازد اما نمایش نمی‌دهد (display: none).
             مقادیر انیمیشن (MotionValues) مستقیماً به فیلتر پاس داده می‌شوند تا
             بدون ری-رندر شدن React، ویژگی‌های SVG آپدیت شوند.
          */}
          <Filter
            id="magnifying-glass-filter"
            width={width}
            height={height}
            radius={radius}
            // ✅ تنظیمات درست برای لنز ذره‌بین:
            bezelWidth={25} // لبه ضخیم‌تر
            glassThickness={110} // ضخامت زیاد برای شکست نور قوی
            bezelType="convex_squircle" // یا "convex" (شکل محدب عدسی)
            refractiveIndex={1.5}
            magnifyingScale={magnifyingScale}
            blur={0}
          />
          {/* لایه شیشه‌ای:
             اینجا جادو اتفاق می‌افتد. با استفاده از backdrop-filter به ID فیلتر بالا اشاره می‌کنیم.
          */}
          <motion.div
            className="absolute inset-0 ring-1 ring-black/10"
            style={{
              borderRadius: radius,
              backdropFilter: `url(#magnifying-glass-filter)`, // اعمال فیلتر شکست نور
              boxShadow
            }}
          />
        </motion.div>
      </div>

      {/* کنترل‌های اسلایدر پایین صفحه (برای تغییر دستی پارامترها) */}
    </>
  );
};

export default MagnifyingGlass;
