import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface Props {
  onClose: () => void;
}

export function PromotionHeader({ onClose }: Props) {
  const [time, setTime] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="bg-[#0c4a6e] text-white relative overflow-hidden"
    >
      {/* Animated wave background */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{ x: [0, -100, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 80px)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-4 md:gap-8 relative">
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="hidden sm:inline"
          style={{ fontSize: "0.875rem" }}
        >
          Free shipping over $200
        </motion.span>
        <span className="sm:hidden" style={{ fontSize: "0.75rem" }}>Free shipping $200+</span>

        <div className="flex items-center gap-1" style={{ fontSize: "0.875rem" }}>
          <span className="bg-white/20 rounded px-1.5 py-0.5 font-mono">{pad(time.hours)}</span>
          <span>:</span>
          <span className="bg-white/20 rounded px-1.5 py-0.5 font-mono">{pad(time.minutes)}</span>
          <span>:</span>
          <span className="bg-white/20 rounded px-1.5 py-0.5 font-mono">{pad(time.seconds)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-[#0c4a6e] px-4 py-1 rounded-full hover:bg-blue-50 transition-colors"
          style={{ fontSize: "0.75rem" }}
        >
          Order Now
        </motion.button>

        <button
          onClick={onClose}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}
