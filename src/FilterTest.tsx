import React, { useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';
import { Filter } from './components/Filter';

interface LiquidBoxProps {
  id: string;
  bezelType: "convex_squircle" | "convex" | "concave" | "lip";
  color?: string;
}

export const LiquidBox: React.FC<LiquidBoxProps> = ({ id, bezelType, color = "rgba(255,255,255,0.08)" }) => {
  const [isEnlarged, setIsEnlarged] = useState(false);
  
  // تعریف ابعاد پایه (عرض زیاد و ارتفاع ۱.۵ برابر)
  const baseWidth = 380;
  const baseHeight = 70; // 180 * 1.5
  const scaleFactor = 1.35;

  // مقادیر انیمیشن برای ابعاد
  const width = isEnlarged ? baseWidth * scaleFactor : baseWidth;
  const height = isEnlarged ? baseHeight * scaleFactor : baseHeight;
  const radius = isEnlarged ? 50 : 35;

  // تنظیمات فنری برای حس لیوکید (بسیار نرم و با جرم بالا)
  const springConfig = { stiffness: 100, damping: 10, mass: 1.2 };

  return (
    <motion.div
      layout
      onClick={() => setIsEnlarged(!isEnlarged)}
      className="relative cursor-pointer group"
      animate={{ width, height }}
      transition={springConfig}
      whileHover={{ y: -5, rotate: isEnlarged ? 0 : 1 }}
      whileTap={{ scale: 0.96 }}
    >
      {/* فراخوانی فیلتر مخصوص هر باکس */}
      <Filter
        id={id}
        width={width}
        height={height}
        radius={radius}
        bezelWidth={isEnlarged ? 28 : 20}
        glassThickness={isEnlarged ? 120 : 80}
        refractiveIndex={1.55}
        bezelType={bezelType}
        scaleRatio={isEnlarged ? 1.4 : 1}
        specularOpacity={isEnlarged ? 0.6 : 0.4}
      />

      {/* لایه بصری بدنه شیشه */}
      <motion.div
        className="absolute inset-0 border border-white/30 shadow-2xl overflow-hidden"
        style={{
          borderRadius: radius,
          backdropFilter: `url(#${id})`,
          backgroundColor: color,
        }}
      >
        {/* افکت نوری داخلی (Gloss) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      </motion.div>

      {/* متن توضیحات */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none z-10">
        <span className="text-white font-black text-sm uppercase tracking-widest opacity-40 group-hover:opacity-70 transition-opacity">
          {bezelType.replace('_', ' ')}
        </span>
        {isEnlarged && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-blue-300 text-[10px] font-bold mt-2"
          >
            REFRACTION ACTIVE
          </motion.span>
        )}
      </div>
    </motion.div>
  );
};