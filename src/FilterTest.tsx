import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { Filter } from './components/Filter';

export const LiquidNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // --- ابعاد بهینه برای سرعت ---
  const collapsedHeight = 70;
  const expandedHeight = 20 * 16;
  const radius = collapsedHeight / 2;
  
  // --- فیزیک انیمیشن با استیفنس بالاتر برای حس Apple ---
  const openMotion = useSpring(isOpen ? 1 : 0, { stiffness: 400, damping: 25 });

  // 1. سایه (Shadow) - نرم‌تر و ظریف‌تر
  const shadowOpacity = useTransform(openMotion, [0, 1], [0.08, 0.2]);
  const shadowY = useTransform(openMotion,  [0, 1], [2, 12]);
  const shadowBlur = useTransform(openMotion, [0, 1], [8, 24]);
  
  const boxShadow = useTransform(
    [shadowY, shadowBlur, shadowOpacity],
    ([y, b, o]) => `0 ${y}px ${b}px rgba(0, 0, 0, ${o})`
  );

  // 2. تپش موقع کلیک (برای حس دکمه بودن) - سریع‌تر
  const scale = useSpring(1, { stiffness: 400, damping: 30 });

  // 3. فیلتر (Blur) - کاهش بلور برای سرعت بیشتر
  const blur = useMotionValue(1.5);
  useEffect(() => {
    blur.set(isOpen ? 2 : 1.5);
  }, [isOpen]);

  return (
    <div className="fixed top-20 right-0 left-0 z-50 flex justify-center items-center pointer-events-none">
      <motion.nav
        animate={{
          height: isOpen ? expandedHeight : collapsedHeight
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseDown={() => scale.set(0.98)}
        onMouseUp={() => scale.set(1)}
        onMouseLeave={() => scale.set(1)}
        className="relative cursor-pointer pointer-events-auto"
        style={{
          width: 620,
          borderRadius: radius,
          scale,
          boxShadow
        }}>
        {/* --- لایه ۱: فیلتر هوشمند --- */}
        <Filter
          id="navbar-glass"
          width={620}
          height={isOpen ? expandedHeight : collapsedHeight}
          radius={radius}
          bezelWidth={20}
          glassThickness={60}
          refractiveIndex={1.5}
          bezelType="squircle"
          blur={blur}
          specularOpacity={0.15}
          specularSaturation={2}
        />

        {/* --- لایه ۲: بدنه شیشه‌ای --- */}
        <motion.div
          className="absolute inset-0 ring-1 ring-white/10"
          style={{
            borderRadius: radius,
            backdropFilter: `url(#navbar-glass)`,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            boxShadow
          }}
        />

        {/* --- لایه ۳: محتوا --- */}
        <div className="relative z-10 w-full h-full flex flex-col">
          {/* هدر */}
          <div className="h-[70px] flex items-center justify-between p-6 group w-full">
            <img
              src="/sia.png"
              alt="S Logo"
              className="h-12 w-12 transition-transform duration-300 group-hover:scale-105"
            />

            <motion.div 
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="text-gray-400 opacity-80">
              {isOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </motion.div>
          </div>

          {/* لیست لینک‌ها */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.05, staggerChildren: 0.03 }
                }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="flex flex-col gap-1 px-4 pb-6 w-full">
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="h-px w-full bg-white/10 mb-2" />

                {['Dashboard', 'Projects', 'Team', 'Settings'].map(item => (
                  <motion.a
                    key={item}
                    href="#"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="px-4 py-2.5 rounded-lg hover:bg-white/10 text-gray-300 font-medium text-base flex items-center justify-between group transition-colors"
                    onClick={e => e.stopPropagation()}>
                    {item}
                    <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-gray-400">
                      →
                    </span>
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
