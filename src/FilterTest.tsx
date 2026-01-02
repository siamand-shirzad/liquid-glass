import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "motion/react";
import React, { useEffect, useState } from "react";
import { Filter } from "./components/Filter";

export const LiquidNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // --- تنظیمات ابعاد (دقیقاً سایز Searchbox) ---
  const width = 420; // عرض ثابت (مثل سرچ‌باکس)
  const collapsedHeight = 60;
  const expandedHeight = 300; // ارتفاع وقتی باز میشه
  const radius = collapsedHeight / 2;

  // --- فیزیک انیمیشن ---
  const openMotion = useSpring(isOpen ? 1 : 0, { stiffness: 200, damping: 25 });

  // 1. سایه (Shadow) - وقتی باز میشه سایه عمیق‌تر میشه
  const shadowOpacity = useTransform(openMotion, [0, 1], [0.1, 0.25]);
  const shadowY = useTransform(openMotion, [0, 1], [0, 25]);
  const shadowBlur = useTransform(openMotion, [0, 1], [10, 50]);
  
  const boxShadow = useTransform(
    [shadowY, shadowBlur, shadowOpacity],
    ([y, b, o]) => `0 ${y}px ${b}px rgba(0, 0, 0, ${o})`
  );

  // 2. تپش موقع کلیک (برای حس دکمه بودن)
  const scale = useSpring(1, { stiffness: 600, damping: 30 });

  // 3. فیلتر (Blur)
  const blur = useMotionValue(1);
  useEffect(() => {
    // وقتی بازه شفاف باشه، وقتی بسته است کمی بلور داشته باشه (مثل Searchbox)
    blur.set(isOpen ? 1 : 2);
  }, [isOpen]);

  return (
    <div className="fixed top-10 left-0 right-0 z-50 flex justify-center items-start">
      <motion.nav
        // انیمیشن فقط روی ارتفاع (Height) اعمال میشه
        initial={false}
        animate={{
          height: isOpen ? expandedHeight : collapsedHeight,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
        
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={() => scale.set(0.98)} // فشرده شدن موقع کلیک
        onMouseUp={() => scale.set(1)}
        onMouseLeave={() => scale.set(1)}
        
        className="relative cursor-pointer z-50 overflow-hidden"
        style={{
          width: width, // عرض ثابت
          borderRadius: radius,
          scale, 
          boxShadow,
        }}
      >
        {/* --- لایه ۱: فیلتر هوشمند --- */}
        {/* چون عرض ثابته، فیلتر خیلی سبک‌تر اجرا میشه */}
        <Filter
            id="navbar-glass"
            width={width}
            height={isOpen ? expandedHeight : collapsedHeight}
            radius={radius}
            
            // تنظیمات شیشه (کپی شده از Searchbox)
            bezelWidth={25}
            glassThickness={80}
            refractiveIndex={1.4}
            bezelType="convex_squircle"
            
            blur={blur}
            specularOpacity={0.5}
            specularSaturation={12}
        />

        {/* --- لایه ۲: بدنه شیشه‌ای --- */}
        <motion.div
          className="absolute inset-0 "
          style={{
            borderRadius: radius,
            backdropFilter: `url(#navbar-glass)`,
            // رنگ شیشه: وقتی بسته است شبیه سرچ‌باکس، وقتی بازه شفاف‌تر
          }}
        />

        {/* --- لایه ۳: محتوا --- */}
        <div className="relative z-10 w-full h-full flex flex-col">
            
            {/* هدر: دقیقاً شبیه Searchbox */}
            <div className="h-[60px] flex items-center justify-between px-6 shrink-0 w-full">
                
                {/* متن سمت چپ (مثل Placeholder سرچ‌باکس) */}
                <span className="text-gray-600 font-medium text-lg tracking-tight">
                    Navigation
                </span>

                {/* آیکون سمت راست (بدون بک‌گراند) */}
                <motion.div 
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    className="text-gray-800 opacity-80"
                >
                    {isOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    )}
                </motion.div>
            </div>

            {/* لیست لینک‌ها (وقتی باز میشه ظاهر میشن) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: 1, 
                            transition: { delay: 0.1, staggerChildren: 0.05 }
                        }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        className="flex flex-col gap-2 px-4 pb-6 w-full"
                    >
                        {/* خط جداکننده ظریف */}
                        <motion.div 
                            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} 
                            className="h-px w-full bg-black/10 mb-2" 
                        />

                        {["Dashboard", "Projects", "Team", "Settings"].map((item) => (
                            <motion.a 
                                key={item}
                                href="#"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="px-4 py-3 rounded-xl hover:bg-white/40 text-gray-700 font-medium text-lg flex items-center justify-between group transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {item}
                                <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-gray-500">→</span>
                            </motion.a>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
      </motion.nav>
    </div>
  );
};