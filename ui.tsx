"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLang } from "@/i18n/LangProvider";

export function Logo({ size = 64, withText = false }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative rounded-2xl overflow-hidden ring-1 ring-rose/30" style={{ width: size, height: size }}>
        <Image src="/brand/logo.jpeg" alt="O'rian Dessert" fill className="object-cover" priority />
      </div>
      {withText && (
        <div className="leading-tight">
          <p className="serif text-2xl text-rose-light">O&rsquo;rian Dessert</p>
          <p className="text-[10px] tracking-[0.3em] text-gold/70">SINCE 2023</p>
        </div>
      )}
    </div>
  );
}

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="glass rounded-full p-1 flex text-xs font-medium tap">
      {(["zh", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 rounded-full transition-all ${
            lang === l ? "bg-rose text-cocoa-dark shadow" : "text-cream/60 hover:text-cream"
          }`}
        >
          {l === "zh" ? "中文" : "English"}
        </button>
      ))}
    </div>
  );
}

export function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass rounded-3xl shadow-glass ${className}`}>{children}</div>;
}

export function Spinner() {
  const { t } = useLang();
  return (
    <div className="flex items-center justify-center gap-2 text-rose/70 py-10">
      <motion.span
        className="block w-4 h-4 rounded-full border-2 border-rose border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      <span className="text-sm">{t.loading}</span>
    </div>
  );
}

// The daifuku stamp icon — rendered as the product photo for unlocked,
// frosted glass outline for locked. Used across the stamp card.
export function DaifukuStamp({
  unlocked,
  index,
  justAdded = false,
}: { unlocked: boolean; index: number; justAdded?: boolean }) {
  return (
    <div className="relative aspect-square rounded-2xl flex items-center justify-center select-none">
      {/* Locked: frosted glass outline */}
      {!unlocked && (
        <div className="absolute inset-0 rounded-2xl glass border-dashed border-rose/25 flex items-center justify-center">
          <span className="serif text-rose/25 text-lg">{index + 1}</span>
        </div>
      )}
      {/* Unlocked: daifuku with rose-gold glow */}
      {unlocked && (
        <motion.div
          initial={justAdded ? { scale: 0, y: -30, rotate: -12 } : false}
          animate={{ scale: 1, y: 0, rotate: 0 }}
          transition={justAdded
            ? { type: "spring", stiffness: 420, damping: 14 }
            : { duration: 0 }}
          className="absolute inset-0 rounded-2xl flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at 50% 45%, rgba(201,163,107,0.28), rgba(81,60,59,0.15))",
            boxShadow: "0 0 22px rgba(201,163,107,0.5), inset 0 0 12px rgba(226,59,46,0.1)",
          }}
        >
          <Image src="/brand/daifuku-crop.png" alt="" width={64} height={64}
            className="object-contain drop-shadow-[0_4px_8px_rgba(226,59,46,0.35)] w-[70%] h-[70%]" />
        </motion.div>
      )}
    </div>
  );
}
