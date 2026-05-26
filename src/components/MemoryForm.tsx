import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Props = {
  onSubmit: (text: string, author?: string) => void;
  submitted: boolean;
  isLoading: boolean;
  isError?: boolean;
};

export default function MemoryForm({ onSubmit, submitted, isLoading, isError }: Props) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [focused, setFocused] = useState<"text" | "author" | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text.trim(), author.trim() || undefined);
  };

  const charCount = text.length;
  const maxChars = 280;

  useEffect(() => {
    if (isError) {
      toast.error("Something went astray — your mark could not be left. Please try again.");
    }
  }, [isError]);

  return (
    <div className="text-center px-4">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.6rem",
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "oklch(0.55 0.08 68)",
            marginBottom: "1.8rem",
          }}
        >
          Leave your mark on time
        </p>

        <h2
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(1.4rem, 4vw, 2.4rem)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            lineHeight: 1.2,
            marginBottom: "1rem",
            background:
              "linear-gradient(135deg, oklch(0.45 0.08 65) 0%, oklch(0.82 0.16 75) 50%, oklch(0.95 0.08 85) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          WHAT DO YOU
          <br />
          CARRY WITH YOU?
        </h2>

        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
            fontStyle: "italic",
            fontWeight: 300,
            color: "oklch(0.60 0.05 80)",
            lineHeight: 1.8,
            marginBottom: "2.5rem",
            maxWidth: "380px",
            margin: "0 auto 2.5rem",
          }}
        >
          A word. A feeling. A fragment of something you once saw.
          <br />
          It will drift here, among the ruins, for those who come after.
        </p>
      </motion.div>

      {/* Form or success state */}
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0 }}
            style={{ padding: "2rem 0" }}
          >
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.2em",
                  color: "oklch(0.75 0.13 68)",
                  marginBottom: "0.75rem",
                }}
              >
                ✦ Your mark has been left ✦
              </p>
            </motion.div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: "italic",
                fontSize: "0.95rem",
                color: "oklch(0.55 0.06 80)",
                lineHeight: 1.7,
              }}
            >
              It now drifts among the echoes,
              <br />
              waiting to be found by those who follow.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}
          >
            {/* Main text input */}
            <div style={{ width: "100%", position: "relative" }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value.slice(0, maxChars))}
                onFocus={() => setFocused("text")}
                onBlur={() => setFocused(null)}
                placeholder="A word. A sentence. A memory."
                rows={3}
                style={{
                  width: "100%",
                  background: "oklch(0.09 0.015 260 / 0.7)",
                  border: `1px solid ${focused === "text" ? "oklch(0.65 0.12 68 / 0.7)" : "oklch(0.22 0.03 260)"}`,
                  borderRadius: "6px",
                  padding: "14px 16px",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  color: "oklch(0.88 0.05 80)",
                  lineHeight: 1.7,
                  resize: "none",
                  outline: "none",
                  transition: "border-color 0.3s",
                  backdropFilter: "blur(8px)",
                  boxShadow: focused === "text"
                    ? "0 0 0 1px oklch(0.65 0.12 68 / 0.2), 0 4px 20px oklch(0.06 0.01 260 / 0.5)"
                    : "0 4px 20px oklch(0.06 0.01 260 / 0.3)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "12px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.55rem",
                  color: charCount > maxChars * 0.85
                    ? "oklch(0.65 0.15 30)"
                    : "oklch(0.38 0.04 260)",
                  letterSpacing: "0.05em",
                }}
              >
                {charCount}/{maxChars}
              </span>
            </div>

            {/* Author input */}
            <input
              type="text"
              value={author}
              onChange={e => setAuthor(e.target.value.slice(0, 100))}
              onFocus={() => setFocused("author")}
              onBlur={() => setFocused(null)}
              placeholder="Your name, or leave it to the wind"
              style={{
                width: "100%",
                background: "oklch(0.09 0.015 260 / 0.5)",
                border: `1px solid ${focused === "author" ? "oklch(0.55 0.10 68 / 0.5)" : "oklch(0.18 0.02 260)"}`,
                borderRadius: "6px",
                padding: "10px 16px",
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 300,
                letterSpacing: "0.05em",
                color: "oklch(0.65 0.05 80)",
                outline: "none",
                transition: "border-color 0.3s",
                backdropFilter: "blur(8px)",
              }}
            />

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={!text.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                marginTop: "0.5rem",
                padding: "12px 40px",
                background: text.trim()
                  ? "linear-gradient(135deg, oklch(0.55 0.12 68), oklch(0.72 0.14 72))"
                  : "oklch(0.15 0.02 260)",
                border: `1px solid ${text.trim() ? "oklch(0.72 0.14 72 / 0.4)" : "oklch(0.22 0.03 260)"}`,
                borderRadius: "4px",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: text.trim() ? "oklch(0.06 0.01 260)" : "oklch(0.35 0.04 260)",
                cursor: text.trim() ? "pointer" : "not-allowed",
                transition: "all 0.4s",
                boxShadow: text.trim()
                  ? "0 4px 24px oklch(0.65 0.14 68 / 0.25)"
                  : "none",
              }}
            >
              {isLoading ? "Leaving your mark…" : "Cast it into time"}
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Footer note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        style={{
          marginTop: "3rem",
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.55rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "oklch(0.30 0.03 260)",
        }}
      >
        Valley of the Temples · Agrigento, Sicily · c. 450 BCE — present
      </motion.p>
    </div>
  );
}
