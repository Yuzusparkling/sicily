import { motion } from "framer-motion";
import { useLocation } from "wouter";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex items-center justify-center select-none"
      style={{ background: "#050508", fontFamily: "'Cormorant Garamond', 'Cinzel', serif" }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "560px", padding: "0 24px", textAlign: "center" }}>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            fontSize: "clamp(10px, 1vw, 13px)",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            fontFamily: "'Cinzel', serif",
            fontWeight: 400,
            color: "rgba(255,255,255,0.35)",
            margin: 0,
            marginBottom: "12px",
          }}
        >
          Spring 2026
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          style={{
            fontSize: "clamp(22px, 3.2vw, 38px)",
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.2,
            margin: 0,
            marginBottom: "20px",
          }}
        >
          Sicily Through Time
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{
            fontSize: "clamp(16px, 1.6vw, 20px)",
            fontFamily: "'Cormorant Garamond', serif",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
            margin: 0,
            marginBottom: "32px",
          }}
        >
          Follow two girls on their trip to Sicily in spring 2026 — traveling through time and discovering the rich layers of history that shaped this island.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            width: "min(380px, 80vw)",
            aspectRatio: "4 / 3",
            borderRadius: "8px",
            overflow: "hidden",
            marginBottom: "36px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
          }}
        >
          <img
            src="/photos/6-modern-hanging out.JPG"
            alt="Two travelers in Sicily"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          whileHover={{ scale: 1.04, opacity: 0.85 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/timeline")}
          style={{
            padding: "8px 28px",
            fontSize: "clamp(11px, 1vw, 14px)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            color: "#050508",
            background: "rgba(255,255,255,0.9)",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Start
        </motion.button>
      </div>
    </div>
  );
}
