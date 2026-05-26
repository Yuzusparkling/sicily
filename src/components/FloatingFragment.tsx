import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Fragment = {
  id: string;
  text: string;
  author?: string | null;
  era?: string;
  isHistorical: boolean;
};

type Props = {
  fragment: Fragment;
  index: number;
  total: number;
};

// Deterministic seeded random based on index
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export default function FloatingFragment({ fragment, index, total }: Props) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Assign stable positions and animation params based on index
  const params = useMemo(() => {
    const r = (offset: number) => seededRandom(index * 7 + offset);
    const startX = 5 + r(0) * 85; // % across screen
    const startY = 8 + r(1) * 78; // % down screen
    const driftX = (r(2) - 0.5) * 120; // px drift
    const driftY = (r(3) - 0.5) * 80;
    const duration = 18 + r(4) * 22; // 18–40s cycle
    const delay = -r(5) * duration; // stagger start
    const opacity = fragment.isHistorical
      ? 0.28 + r(6) * 0.32
      : 0.35 + r(6) * 0.35;
    const fontSize = fragment.isHistorical
      ? 0.62 + r(7) * 0.28 // 0.62–0.90rem
      : 0.68 + r(7) * 0.22;
    const maxWidth = 160 + r(8) * 120; // 160–280px

    return { startX, startY, driftX, driftY, duration, delay, opacity, fontSize, maxWidth };
  }, [index, fragment.isHistorical]);

  // Truncate text for ambient display
  const displayText =
    fragment.text.length > 60 ? fragment.text.slice(0, 58) + "…" : fragment.text;

  return (
    <motion.div
      ref={ref}
      className="absolute select-none"
      style={{
        left: `${params.startX}%`,
        top: `${params.startY}%`,
        zIndex: hovered ? 50 : 10,
        pointerEvents: "auto",
      }}
      animate={{
        x: [0, params.driftX * 0.4, params.driftX, params.driftX * 0.6, 0],
        y: [0, params.driftY * 0.3, params.driftY, params.driftY * 0.5, 0],
        opacity: [
          params.opacity * 0.6,
          params.opacity,
          params.opacity * 0.85,
          params.opacity,
          params.opacity * 0.6,
        ],
      }}
      transition={{
        duration: params.duration,
        delay: params.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(v => !v)}
    >
      {/* Fragment text */}
      <p
        className={fragment.isHistorical ? "" : "text-glow-subtle"}
        style={{
          fontFamily: fragment.isHistorical
            ? "'Cormorant Garamond', serif"
            : "'Inter', sans-serif",
          fontStyle: fragment.isHistorical ? "italic" : "normal",
          fontWeight: fragment.isHistorical ? 400 : 300,
          fontSize: `${params.fontSize}rem`,
          color: fragment.isHistorical
            ? `oklch(0.80 0.08 75 / ${params.opacity + 0.1})`
            : `oklch(0.85 0.12 68 / ${params.opacity + 0.15})`,
          maxWidth: `${params.maxWidth}px`,
          lineHeight: 1.5,
          cursor: "default",
          transition: "color 0.3s, text-shadow 0.3s",
          ...(hovered && {
            color: fragment.isHistorical
              ? "oklch(0.92 0.10 75)"
              : "oklch(0.95 0.15 68)",
            textShadow:
              "0 0 12px oklch(0.75 0.12 65 / 0.5), 0 0 24px oklch(0.75 0.12 65 / 0.25)",
          }),
        }}
      >
        {displayText}
      </p>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="absolute z-50"
            style={{
              top: "calc(100% + 10px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(260px, 80vw)",
              background: "oklch(0.09 0.015 260 / 0.95)",
              border: "1px solid oklch(0.28 0.05 68 / 0.6)",
              borderRadius: "6px",
              padding: "14px 16px",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 8px 32px oklch(0.06 0.01 260 / 0.8), 0 0 0 1px oklch(0.75 0.13 68 / 0.08)",
              pointerEvents: "none",
            }}
          >
            {/* Era badge */}
            <span
              style={{
                display: "inline-block",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "oklch(0.65 0.12 68)",
                marginBottom: "8px",
                padding: "2px 8px",
                border: "1px solid oklch(0.65 0.12 68 / 0.3)",
                borderRadius: "3px",
              }}
            >
              {fragment.era ?? "A visitor's mark"}
            </span>

            {/* Full quote */}
            <p
              style={{
                fontFamily: fragment.isHistorical
                  ? "'Cormorant Garamond', serif"
                  : "'Inter', sans-serif",
                fontStyle: fragment.isHistorical ? "italic" : "normal",
                fontSize: "0.82rem",
                fontWeight: 400,
                color: "oklch(0.88 0.05 80)",
                lineHeight: 1.65,
                marginBottom: "10px",
              }}
            >
              "{fragment.text}"
            </p>

            {/* Author */}
            {fragment.author && (
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: "oklch(0.55 0.07 68)",
                  textAlign: "right",
                }}
              >
                — {fragment.author}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
