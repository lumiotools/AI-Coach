"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RotatingTextProps {
  texts: string[];
  interval?: number;
  subtitle: string;
}

export default function RotatingText({
  texts,
  interval = 2000,
  subtitle,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts, interval]);

  return (
    <div className="inline md:flex items-center justify-center space-x-4 mt-2">
      <div className="h-8 md:h-14 lg:h-[4.8rem] overflow-y-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <span className="text-blue-500 hover:text-blue-700 text-2xl md:text-5xl lg:text-7xl font-bold">
              {texts[index]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="text-white text-2xl md:text-5xl lg:text-7xl font-bold">
        {subtitle}
      </span>
    </div>
  );
}
