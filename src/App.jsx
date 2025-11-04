import React from 'react';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-500">
      <ThemeToggle />
      <Hero />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-24 relative z-10">
        <Dashboard />
      </main>
    </div>
  );
}
