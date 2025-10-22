// 📁 SetupWizard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

import StepWelcome from "./StepWelcome";
import StepOwnerEmployment from "./StepOwnerEmployment";
import StepRestaurant from "./StepRestaurant";
import StepFinish from "./StepFinish";
import NavbarWizard from "./navbarWizard";

/**
 * SetupWizard Component
 * Handles multi-step setup wizard for first-time configuration
 * Steps: Welcome → Owner → Restaurant → Finish
 */
const SetupWizard = () => {
  const [step, setStep] = useState(0);

  // App-wide settings for language and theme
  const [theme, setTheme] = useState("light");
  const [lang, setLang] = useState("en");

  // Load saved preferences (theme + language)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    const savedLang = localStorage.getItem("lang") || "en";
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Go to next or previous step
  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 0));

  // Steps configuration
  const steps = [
    <StepWelcome onNext={nextStep} key="welcome" />,
    <StepOwnerEmployment onNext={nextStep} onBack={prevStep} key="employment" />,
    <StepRestaurant onNext={nextStep} onBack={prevStep} key="restaurant" />,
    <StepFinish key="finish" />,
  ];

  return (
    <>
      {/* 🌐 Top Navbar (visible on all steps) */}
      <NavbarWizard
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
      />

      {/* ⚙️ Animated Step Container */}
      <motion.div
        className={`container-fluid py-4 ${
          theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: "calc(100vh - 60px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="w-100" style={{ maxWidth: "600px" }}>
          {steps[step]}
        </div>

        <p className="text-muted mt-4">
          Step {step + 1} of {steps.length}
        </p>
      </motion.div>
    </>
  );
};

export default SetupWizard;
