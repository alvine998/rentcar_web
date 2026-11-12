"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SLIDES = [
  { src: "/cars/xpander.jpg", alt: "Mitsubishi Xpander" },
  { src: "/cars/fortuner.jpg", alt: "Toyota Fortuner" },
  { src: "/cars/alphard.jpg", alt: "Toyota Alphard" },
];

const INTERVAL = 5000;

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      INTERVAL,
    );
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-[#e3f2fd]">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.9, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.8 }, scale: { duration: 7, ease: "linear" } }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#e3f2fd]/90 via-white/20 to-white/40" />

      {!reduce && (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-accent" : "w-1.5 bg-ink/25 hover:bg-ink/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
