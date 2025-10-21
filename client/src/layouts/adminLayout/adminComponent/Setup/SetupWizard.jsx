// 📁 SetupWizard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarWizard from "./Navbar";
import React, { useState } from "react";
import { motion } from "framer-motion";
import StepWelcome from "./StepWelcome";
import StepOwner from "./StepOwner";
import StepRestaurant from "./StepRestaurant";
import StepFinish from "./StepFinish";


const SetupWizard = () => {
  const [step, setStep] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepWelcome onNext={() => setStep(1)} />;
      case 1:
        return <StepOwner onNext={() => setStep(2)} onBack={() => setStep(0)} />;
      case 2:
        return <StepRestaurant onNext={() => setStep(3)} onBack={() => setStep(1)} />;
      case 3:
        return <StepFinish />;
      default:
        return null;
    }
  };

  return (
    <div className={`${darkMode ? "bg-dark text-light" : "bg-white text-dark"} min-vh-100`}>
      <NavbarWizard
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
      <div className="container py-4">
        {renderStep()}
      </div>
    </div>
  );
};

export default SetupWizard;
