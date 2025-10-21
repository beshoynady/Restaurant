import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Globe } from "lucide-react";

const Navbar = ({ lang, setLang, theme, setTheme }) => {
  // Toggle dark/light mode
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // Toggle language
  const toggleLang = () => setLang(lang === "en" ? "ar" : "en");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <motion.nav
      className="flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-900 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        Smart Menu Setup
      </h1>

      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
          title="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center gap-1"
          title="Change Language"
        >
          <Globe size={16} />
          <span className="font-medium">{lang === "en" ? "AR" : "EN"}</span>
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
