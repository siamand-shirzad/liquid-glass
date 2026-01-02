import { motion, useScroll, useTransform, useSpring } from "motion/react";
import React, { useState, useEffect, useMemo } from "react";
import { Filter } from "./Filter";

// --- ۱. هوک داخلی برای محاسبه ابعاد پنجره ---
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth });
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}

export const Navbar: React.FC = () => {
  const { width } = useWindowSize();
  
  // تنظیمات ابعاد کپسول
  const navHeight = 64;
  // عرض نوبار در دسکتاپ ۹۰٪ صفحه تا حداکثر ۱۰۰۰ پیکسل، در موبایل ۹۵٪
  const navWidth = Math.min(width * 0.95, 1000);
  const navRadius = navHeight / 2;

  // ۲. منطق اسکرول
  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, 100], [0, 1]);

  // ۳. متغیرهای حرکتی برای فیلتر
  const dynamicBlur = useSpring(useTransform(scrollProgress, [0, 1], [0, 8]), { damping: 25 });
  const dynamicRefraction = useSpring(useTransform(scrollProgress, [0, 1], [0.8, 1.2]), { damping: 20 });
  const dynamicY = useSpring(useTransform(scrollProgress, [0, 1], [20, 10]), { damping: 30 });

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      style={{ top: dynamicY }}
    >
      {/* کانتینر اصلی نوبار */}
      <div 
        className="relative pointer-events-auto" 
        style={{ width: navWidth, height: navHeight }}
      >
        
        {/* ۴. فراخوانی فیلتر مخصوص کپسول */}
        <Filter
          id="capsule-nav-filter"
          width={navWidth}
          height={navHeight}
          radius={navRadius}
          bezelWidth={15}
          glassThickness={60}
          refractiveIndex={1.4}
          bezelType="convex_squircle" // حالت محدب برای حس کپسولی
          blur={dynamicBlur}
          scaleRatio={dynamicRefraction}
          specularOpacity={0.4}
          specularSaturation={8}
        />

        {/* ۵. لایه بصری شیشه */}
        <motion.div
          className="absolute inset-0 border border-white/30 shadow-2xl"
          style={{
            borderRadius: navRadius,
            backdropFilter: `url(#capsule-nav-filter)`,
            backgroundColor: useTransform(scrollProgress, [0, 1], ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.3)"]),
            boxShadow: useTransform(scrollProgress, [0, 1], [
                "0 4px 20px rgba(0,0,0,0.05)", 
                "0 10px 40px rgba(0,0,0,0.15)"
            ]),
          }}
        />

        {/* ۶. محتوا (Logo, Links, Button) */}
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              L
            </div>
            <span className="hidden sm:block font-black text-black/70 mix-blend-overlay tracking-tight">
              PORTFOLIO
            </span>
          </div>

          {/* Links */}
          <ul className="flex items-center gap-6 md:gap-10">
            {["Work", "About", "Contact"].map((item) => (
              <li key={item}>
                <motion.a
                  href={`#${item.toLowerCase()}`}
                  className="text-xs md:text-sm font-bold text-black/60 hover:text-black transition-colors"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item}
                </motion.a>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,1)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-black/80 text-white text-[10px] md:text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg"
          >
            Hire Me
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};