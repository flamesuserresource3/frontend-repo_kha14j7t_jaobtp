import React from 'react';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-[65vh] w-full overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <Spline
          scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Soft gradient glow overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-white dark:from-slate-950/60 dark:via-slate-950/30 dark:to-slate-950" />

      <div className="relative z-10 h-full flex items-end">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="backdrop-blur-md bg-white/30 dark:bg-slate-900/40 border border-white/30 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_30px_rgba(0,0,0,0.15)] rounded-2xl p-6 sm:p-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              Calm, tactile dashboard for your day
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl">
              Plan, track, and reflect with a minimal glassmorphic workspace. Designed to feel like a
              mix of Notion, Arc, and Apple.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
