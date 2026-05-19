"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full py-20 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-rose-300/30 dark:bg-rose-900/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-300/30 dark:bg-pink-900/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 px-4"
      >
        <span className="text-rose-500 dark:text-rose-400 font-medium tracking-widest uppercase text-sm mb-4 block">
          Rakhee's NailStudio
        </span>
        <h1 className="text-5xl md:text-6xl font-serif text-slate-900 dark:text-white mb-6 leading-tight">
          Share Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">
            Flawless Experience
          </span>
        </h1>
      </motion.div>
    </section>
  );
}