import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ERAS, Era } from "@/data/eras";
import MarbleShader, { ShaderName } from "@/components/MarbleShader";

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255,
  ];
}

// ── Wheel constants ───────────────────────────────────────────────────────────

const SLOT_COUNT = 12;
const SLOT_ANGLE = 360 / SLOT_COUNT; // 30° per slot
const ROTATE_INTERVAL_MS = 5000;
const WHEEL_RADIUS = "30vw";

function buildWheelQuotes(era: Era): string[] {
  return Array.from({ length: SLOT_COUNT }, (_, i) => era.arcQuotes[i % era.arcQuotes.length]);
}

// ── Floating word fragments ───────────────────────────────────────────────────

interface FloatingFragment {
  id: number;
  text: string;
  x: number; y: number;
  maxOpacity: number;
  duration: number; delay: number;
  fontSize: number; angle: number;
  driftX: number; driftY: number;
}

let fragId = 0;
function makeFragment(text: string): FloatingFragment {
  return {
    id: fragId++, text,
    x: 2 + Math.random() * 62,
    y: 5 + Math.random() * 82,
    maxOpacity: 0.10 + Math.random() * 0.22,
    duration: 10 + Math.random() * 12,
    delay: Math.random() * 3,
    fontSize: 10 + Math.random() * 9,
    angle: -12 + Math.random() * 24,
    driftX: (Math.random() - 0.5) * 40,
    driftY: -20 - Math.random() * 40,
  };
}

// ── Shader assignment ────────────────────────────────────────────────────────

const ALL_SHADERS: ShaderName[] = ["flowing", "ether", "wavy"];

function shuffleShaders(): ShaderName[] {
  const arr = [...ALL_SHADERS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // 6 eras, 3 shaders — cycle through with random order
  return [...arr, ...arr].slice(0, ERAS.length);
}

// ── Scroll constants ──────────────────────────────────────────────────────────

const SCROLL_THRESHOLD = 150;
const TRANSITION_COOLDOWN_MS = 800;

// ── Component ─────────────────────────────────────────────────────────────────

export default function Clock() {
  const [eraIndex, setEraIndex] = useState(0);
  const [wheelStep, setWheelStep] = useState(0);
  const [fragments, setFragments] = useState<FloatingFragment[]>([]);
  const [selectedPhotoIdx, setSelectedPhotoIdx] = useState(0);
  const [hoveredPhotoIdx, setHoveredPhotoIdx] = useState<number | null>(null);

  // Assign a random shader to each era on mount (stable for the session)
  const eraShaders = useMemo(() => shuffleShaders(), []);

  const prevEraId = useRef<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccumRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const era = ERAS[eraIndex];
  const accent = era.color;
  const wheelQuotes = buildWheelQuotes(era);
  const totalRotationDeg = -wheelStep * SLOT_ANGLE;

  // Current cover photo (supports carousel selection)
  const currentPhotoObj = era.placePhotos[selectedPhotoIdx] ?? era.placePhotos[0];
  const currentPhoto = currentPhotoObj.src;
  const activeCaption = currentPhotoObj.caption;
  const activeTitle = currentPhotoObj.title;
  const activeLocation = currentPhotoObj.location;

  // ── Scroll-driven era switching ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioningRef.current) return;

      scrollAccumRef.current += e.deltaY;

      if (scrollAccumRef.current > SCROLL_THRESHOLD) {
        setEraIndex(prev => {
          if (prev >= ERAS.length - 1) return prev;
          isTransitioningRef.current = true;
          setTimeout(() => { isTransitioningRef.current = false; }, TRANSITION_COOLDOWN_MS);
          return prev + 1;
        });
        scrollAccumRef.current = 0;
      } else if (scrollAccumRef.current < -SCROLL_THRESHOLD) {
        setEraIndex(prev => {
          if (prev <= 0) return prev;
          isTransitioningRef.current = true;
          setTimeout(() => { isTransitioningRef.current = false; }, TRANSITION_COOLDOWN_MS);
          return prev - 1;
        });
        scrollAccumRef.current = 0;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Advance wheel one slot every 5s; spawn word fragments.
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setWheelStep(prev => {
        const next = prev + 1;
        const activeSlot = next % SLOT_COUNT;
        const quote = buildWheelQuotes(ERAS[eraIndex])[activeSlot];
        if (quote) {
          const words = quote.split(/\s+/).filter(Boolean).slice(0, 3);
          setFragments(prev => [...prev.slice(-15), ...words.map(makeFragment)]);
        }
        return next;
      });
    }, ROTATE_INTERVAL_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [eraIndex]);

  // Reset on era change.
  useEffect(() => {
    if (era.id !== prevEraId.current) {
      prevEraId.current = era.id;
      setFragments([]);
      setWheelStep(0);
      setSelectedPhotoIdx(0);
      setHoveredPhotoIdx(null);
    }
  }, [era.id]);

  // Determine which quote is currently highlighted (at 3 o'clock / 0°)
  const highlightedArcIdx = (wheelStep % SLOT_COUNT) % era.arcQuotes.length;
  const highlightedQuote = era.arcQuotes[highlightedArcIdx];
  const highlightedTranslation = era.arcTranslations[highlightedArcIdx];
  // Use writings for the author attribution in the lockup (1:1 if 6 writings, 2:1 if 3)
  const writingIdx = era.writings.length >= 6 ? highlightedArcIdx : Math.floor(highlightedArcIdx / 2);
  const highlightedWriting = era.writings[writingIdx] ?? era.writings[0];

  // Per-slot opacity: falls off with angular distance from 3 o'clock (0°).
  function getSlotOpacity(slotIndex: number): number {
    const deg = (slotIndex * SLOT_ANGLE + totalRotationDeg % 360 + 360) % 360;
    const dist = deg > 180 ? 360 - deg : deg;
    if (dist < 5)   return 1.00;
    if (dist < 35)  return 0.55;
    if (dist < 65)  return 0.32;
    if (dist < 95)  return 0.18;
    if (dist < 125) return 0.10;
    return 0.05;
  }

  function isSlotHighlighted(slotIndex: number): boolean {
    const deg = (slotIndex * SLOT_ANGLE + totalRotationDeg % 360 + 360) % 360;
    const dist = deg > 180 ? 360 - deg : deg;
    return dist < 20;
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden flex select-none"
      style={{ background: "#050508", fontFamily: "'Cormorant Garamond', 'Cinzel', serif" }}
    >
      {/* Marble shader background */}
      <MarbleShader eraColor={hexToRgb(accent)} shader={eraShaders[eraIndex]} />

      {/* Subtle darkening overlay on the left panel */}
      <div
        className="absolute pointer-events-none"
        style={{ inset: 0, right: "40vw", background: "rgba(0,0,0,0.20)", zIndex: 1 }}
      />

      {/* Floating word fragments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ right: "40vw" }}>
        <AnimatePresence>
          {fragments.map(frag => (
            <motion.div
              key={frag.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, frag.maxOpacity, frag.maxOpacity * 0.5, 0], x: frag.driftX, y: frag.driftY }}
              transition={{ duration: frag.duration, delay: frag.delay, ease: "easeInOut" }}
              style={{
                position: "absolute",
                left: `${frag.x}%`, top: `${frag.y}%`,
                fontSize: `${frag.fontSize}px`,
                color: accent,
                transform: `rotate(${frag.angle}deg)`,
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                letterSpacing: "0.05em",
                lineHeight: 1.5,
                userSelect: "none",
                textShadow: `0 0 20px ${accent}60`,
                whiteSpace: "nowrap",
                transition: "color 3s",
                mixBlendMode: "screen",
              }}
            >
              {frag.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Spinning wheel (ambient small quotes only) ── */}
      <div
        className="absolute pointer-events-none"
        style={{ left: "2.5rem", top: "50vh", width: 0, height: 0, zIndex: 5 }}
      >
        <svg
          style={{
            position: "absolute",
            left: `calc(-${WHEEL_RADIUS} - 4px)`,
            top: `calc(-${WHEEL_RADIUS} - 4px)`,
            width: `calc(2 * ${WHEEL_RADIUS} + 8px)`,
            height: `calc(2 * ${WHEEL_RADIUS} + 8px)`,
            overflow: "visible",
            transform: `rotate(${totalRotationDeg}deg)`,
            transition: "transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          viewBox="-1 -1 2 2"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.30" style={{ transition: "stop-color 3s" }} />
              <stop offset="100%" stopColor={accent} stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="0.18" fill="url(#centerGlow)" />
        </svg>

        {/* Ambient text labels — all at small uniform size, highlighted slot fades out */}
        {wheelQuotes.map((quote, i) => {
          const highlighted = isSlotHighlighted(i);
          const opacity = highlighted ? 0 : getSlotOpacity(i); // highlighted slot hidden — rendered in overlay instead
          const angleDeg = (i * SLOT_ANGLE + totalRotationDeg % 360 + 360) % 360;
          const angleRad = (angleDeg * Math.PI) / 180;
          const dx = Math.cos(angleRad);
          const dy = Math.sin(angleRad);
          const isRight  = dx > 0.25;
          const isLeft   = dx < -0.25;
          const textAlign: "left" | "right" | "center" = isRight ? "left" : isLeft ? "right" : "center";
          const translateX = isRight ? "8px" : isLeft ? "calc(-100% - 8px)" : "-50%";

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `calc(${dx} * ${WHEEL_RADIUS})`,
                top: `calc(${dy} * ${WHEEL_RADIUS})`,
                transform: `translate(${translateX}, -50%)`,
                opacity,
                transition: "opacity 1.2s ease, left 1.4s cubic-bezier(0.4,0,0.2,1), top 1.4s cubic-bezier(0.4,0,0.2,1)",
                width: "calc(30vw - 60px)",
                textAlign,
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  fontSize: "clamp(12px, 1.1vw, 16px)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  color: "rgba(255,255,255,0.70)",
                  lineHeight: 1.35,
                  letterSpacing: "0.02em",
                  display: "block",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
                  fontWeight: 400,
                }}
              >
                {quote}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Highlighted quote overlay — fixed at 3 o'clock, no layout shifts ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `calc(2.5rem + ${WHEEL_RADIUS} + 8px)`,
          top: "50vh",
          transform: "translateY(-50%)",
          width: "calc(30vw - 60px)",
          zIndex: 6,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`hl-${era.id}-${highlightedArcIdx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.8 }}
          >
            <span
              style={{
                fontSize: "clamp(22px, 2.4vw, 32px)",
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                color: accent,
                lineHeight: 1.35,
                letterSpacing: "0.01em",
                textShadow: `0 0 24px ${accent}80, 0 0 48px ${accent}30`,
                display: "block",
                whiteSpace: "normal",
                wordBreak: "break-word",
                fontWeight: 500,
                transition: "color 3s",
              }}
            >
              {highlightedQuote}
            </span>
            {/* English translation */}
            <span style={{
              fontSize: "clamp(14px, 1.2vw, 18px)",
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "rgba(255,255,255,0.40)",
              lineHeight: 1.55,
              display: "block",
              marginTop: "12px",
            }}>
              &ldquo;{highlightedTranslation}&rdquo;
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Era lockup — character portrait + stacked era info ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={era.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2 }}
          className="absolute z-10 pointer-events-none"
          style={{
            left: "2.5rem",
            top: "50vh",
            transform: "translateY(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{
            width: "67px", height: "67px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: `1.5px solid ${accent}40`,
            boxShadow: `0 0 20px ${accent}20`,
          }}>
            <img
              src={era.heroImage}
              alt={era.eraLabel}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: era.id === "modern" ? "center center" : "center top", display: "block" }}
            />
          </div>
          <div>
            <p style={{ fontSize: "clamp(11px, 0.9vw, 14px)", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "'Cinzel', serif", fontWeight: 400, color: accent, opacity: 0.7, margin: 0, marginBottom: "3px", transition: "color 3s" }}>
              {era.period}
            </p>
            <p style={{ fontSize: "clamp(16px, 1.8vw, 24px)", fontFamily: "'Cinzel', serif", fontWeight: 300, letterSpacing: "0.12em", color: "rgba(255,255,255,0.7)", lineHeight: 1.1, margin: 0 }}>
              {era.eraLabel}
            </p>
            <p style={{ fontSize: "14px", letterSpacing: "0.04em", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, color: "rgba(255,255,255,0.35)", margin: 0, marginTop: "5px" }}>
              {era.quoteSource}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Scroll hint ── */}
      <motion.div
        className="absolute z-20 pointer-events-none"
        style={{ bottom: "2.5rem", left: "2.5rem" }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.2, 0.5], y: [0, 4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <p style={{ fontSize: "8px", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "'Cinzel', serif", color: "rgba(255,255,255,0.3)" }}>
          {eraIndex < ERAS.length - 1 ? "↓ SCROLL TO TRAVEL FORWARD" : "↑ SCROLL TO TRAVEL BACK"}
        </p>
      </motion.div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 z-10"
        style={{
          right: "40vw",
          width: "1px",
          background: `linear-gradient(to bottom, transparent, ${accent}20, transparent)`,
          transition: "background 3s",
        }}
      />

      {/* ── Right panel ── */}
      <div
        className="absolute top-0 right-0 bottom-0 z-10 overflow-hidden"
        style={{ width: "40vw", background: "#0d0d0f", borderLeft: "1px solid rgba(255,255,255,0.06)", fontFamily: "'Cormorant Garamond', serif" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={era.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            {/* Era label row */}
            <div style={{ padding: "22px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "10px", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "'Cinzel', serif", color: accent, opacity: 0.7, transition: "color 3s" }}>
                {era.eraLabel}
              </span>
              <div style={{ width: "2px", height: "20px", background: accent, opacity: 0.4, transition: "background 3s" }} />
            </div>

            {/* Hero image area — 5:4 aspect ratio with overlay text */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "5 / 4", overflow: "hidden", flexShrink: 0 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`photo-${era.id}-${selectedPhotoIdx}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: "absolute", inset: 0 }}
                >
                  {currentPhoto.endsWith(".MOV") || currentPhoto.endsWith(".mp4") ? (
                    <video
                      src={currentPhoto}
                      autoPlay muted loop playsInline
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: currentPhotoObj.objectPosition ?? "center", display: "block" }}
                    />
                  ) : (
                    <img
                      src={currentPhoto}
                      alt={currentPhotoObj.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: currentPhotoObj.objectPosition ?? "center", display: "block" }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom fade */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to top, #0d0d0f, transparent)", pointerEvents: "none" }} />

              {/* Overlay text — bottom of image */}
              <div style={{ position: "absolute", bottom: "12px", left: "16px", right: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${era.id}-${activeTitle}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p style={{
                      fontSize: "clamp(11px, 0.9vw, 14px)",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.85)",
                      margin: 0,
                      marginBottom: "4px",
                    }}>
                      {activeLocation}
                    </p>
                    <h2 style={{
                      fontSize: "clamp(16px, 1.8vw, 24px)",
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 300,
                      letterSpacing: "0.12em",
                      color: "rgba(255,255,255,0.92)",
                      lineHeight: 1.1,
                      margin: 0,
                    }}>
                      {activeTitle}
                    </h2>
                  </motion.div>
                </AnimatePresence>
                <span style={{
                  fontSize: "clamp(32px, 4vw, 52px)",
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 700,
                  color: accent,
                  lineHeight: 1,
                  opacity: 0.8,
                  transition: "color 3s",
                  mixBlendMode: "screen",
                  flexShrink: 0,
                }}>
                  {era.eraIndex}
                </span>
              </div>
            </div>

            {/* Caption — fixed height to prevent layout jumps */}
            <div style={{ padding: "12px 24px 0", height: "200px", position: "relative", overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeCaption}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  style={{ fontSize: "clamp(15px, 1.3vw, 19px)", lineHeight: 1.7, color: "rgba(255,255,255,0.6)", fontFamily: "'Cormorant Garamond', serif", margin: 0, position: "absolute", top: 12, left: 24, right: 24 }}
                >
                  {activeCaption}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Thumbnail area — vertically centered in remaining space */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "0 24px", marginTop: "-150px" }}>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {era.placePhotos.map((photo, idx) => {
                  const isActive = idx === selectedPhotoIdx;
                  const isHovered = idx === hoveredPhotoIdx;
                  const isVideo = photo.src.endsWith(".MOV") || photo.src.endsWith(".mp4");
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIdx(idx)}
                      onMouseEnter={() => setHoveredPhotoIdx(idx)}
                      onMouseLeave={() => setHoveredPhotoIdx(null)}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "6px",
                        overflow: "hidden",
                        border: isActive ? `2px solid ${accent}` : isHovered ? `2px solid ${accent}88` : "2px solid rgba(255,255,255,0.12)",
                        opacity: isActive || isHovered ? 1 : 0.6,
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                        padding: 0,
                        background: "transparent",
                        flexShrink: 0,
                      }}
                    >
                      {isVideo ? (
                        <video
                          src={photo.src}
                          muted
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      ) : (
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
