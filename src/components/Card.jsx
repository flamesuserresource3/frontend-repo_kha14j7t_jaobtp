import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ title, icon, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 border border-white/30 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl p-5 sm:p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-white/70 to-white/20 dark:from-slate-800/70 dark:to-slate-800/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),8px_8px_20px_rgba(0,0,0,0.2),-6px_-6px_16px_rgba(255,255,255,0.6)]">
          {icon}
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
