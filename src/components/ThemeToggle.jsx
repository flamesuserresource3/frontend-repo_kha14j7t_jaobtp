import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = saved ? saved === 'dark' : prefersDark;
    setIsDark(shouldDark);
    document.documentElement.classList.toggle('dark', shouldDark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="fixed top-4 right-4 z-20 group"
    >
      <div className="relative p-3 rounded-2xl backdrop-blur-md bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),_8px_8px_24px_rgba(0,0,0,0.15),_-6px_-6px_20px_rgba(255,255,255,0.5)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.5),_12px_12px_28px_rgba(0,0,0,0.2),_-8px_-8px_24px_rgba(255,255,255,0.6)] transition-all duration-300">
        {isDark ? (
          <Sun className="h-5 w-5 text-amber-400" />
        ) : (
          <Moon className="h-5 w-5 text-sky-600" />
        )}
      </div>
    </button>
  );
}
