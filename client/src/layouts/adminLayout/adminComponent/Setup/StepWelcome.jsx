import React from "react";
import { motion } from "framer-motion";

/**
 * StepWelcome Component
 * First screen in the setup wizard
 * Adapts automatically to light/dark theme
 */
const StepWelcome = ({ onNext, theme = "light" }) => {
  const isDark = theme === "dark";

  return (
    <motion.div
      className={`text-center p-4 rounded-4 shadow-sm ${
        isDark ? "bg-dark text-light" : "bg-white text-dark"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "350px",
        border: isDark ? "1px solid #444" : "1px solid #ddd",
      }}
    >
      <h1
        className={`fw-bold mb-3 ${
          isDark ? "text-info" : "text-primary"
        }`}
      >
        Smart Menu
      </h1>

      <p
        className={`mb-4 ${
          isDark ? "text-light opacity-75" : "text-muted"
        }`}
      >
        Welcome to Smart Menu setup wizard. Let’s start by setting up your account and restaurant details.
      </p>

      <button
        className={`btn px-5 py-2 rounded-pill fw-semibold ${
          isDark ? "btn-outline-light" : "btn-primary"
        }`}
        onClick={onNext}
      >
        Start Setup
      </button>
    </motion.div>
  );
};

export default StepWelcome;
