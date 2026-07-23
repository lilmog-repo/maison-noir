import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function EditorialCampaign() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const opacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full aspect-[16/9] min-h-[70vh] bg-[#111111] overflow-hidden flex items-center justify-center"
    >
      <motion.div 
        className="absolute inset-0 w-full h-[120%]"
        style={{ y }}
      >
        <img 
          src="/campaign.jpg" 
          alt="Editorial Campaign" 
          className="w-full h-full object-cover opacity-60"
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/30" />

      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <h2 className="font-serif text-[clamp(2.5rem,5vw,5.5rem)] text-white leading-tight">
          Worn with certainty.<br/>
          <span className="italic font-light">Made without compromise.</span>
        </h2>
      </motion.div>
    </section>
  );
}
