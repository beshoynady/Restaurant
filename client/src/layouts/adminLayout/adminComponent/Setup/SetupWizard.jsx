// 📁 SetupWizard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

import StepWelcome from "./StepWelcome";
import StepOwnerPersonal from "./StepOwnerPersonal";
import StepOwnerContact from "./StepOwnerContact";
import StepOwnerEmployment from "./StepOwnerEmployment";
import StepRestaurant from "./StepRestaurant";
import StepFinish from "./StepFinish";
import NavbarWizard from "./navbarWizard";
const SetupWizard = () => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const steps = [
    <StepWelcome onNext={nextStep} key="welcome" />,
    // <StepOwnerPersonal onNext={nextStep} onBack={prevStep} key="personal" />,
    // <StepOwnerContact onNext={nextStep} onBack={prevStep} key="contact" />,
    <StepOwnerEmployment
      onNext={nextStep}
      onBack={prevStep}
      key="employment"
    />,
    <StepRestaurant onNext={nextStep} onBack={prevStep} key="restaurant" />,
    <StepFinish key="finish" />,
  ];

  return (
    <>
      {/* <NavbarWizard /> */}
      <motion.div
        className="container d-flex flex-column align-items-center justify-content-center vh-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
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
