"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import Image from "next/image";

// Registers the PWA service worker once on mount.
export function SWRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

// Celebration overlay shown when a reward unlocks (member side) or
// a stamp is added (staff side). Premium particle burst — not childish.
export function Celebration({
  show,
  title,
  subtitle,
  onDone,
}: { show: boolean; title: string; subtitle?: string; onDone?: () => void }) {
  useEffect(() => {
    if (show && onDone) {
      const id = setTimeout(onDone, 2600);
      return () => clearTimeout(id);
    }
  }, [show, onDone]);

  const particles = Array.from({ length: 18 });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-cocoa-dark/70 backdrop-blur-md"
        >
          <div className="relative">
            {particles.map((_, i) => {
              const angle = (i / particles.length) * Math.PI * 2;
              const dist = 120 + Math.random() * 90;
              return (
                <motion.span
                  key={i}
                  className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
                  style={{ background: i % 2 ? "#c9a36b" : "#c6a2a2" }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: [0, 1.2, 0],
                    opacity: [1, 1, 0],
                  }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
              );
            })}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="relative z-10 text-center px-10"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mx-auto mb-4 w-24 h-24"
              >
                <Image src="/brand/daifuku-crop.png" alt="" width={96} height={96}
                  className="object-contain drop-shadow-[0_0_24px_rgba(201,163,107,0.7)]" />
              </motion.div>
              <h2 className="serif text-4xl text-gold-shimmer mb-2">{title}</h2>
              {subtitle && <p className="text-rose-light/90">{subtitle}</p>}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
