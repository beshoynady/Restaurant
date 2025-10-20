import React from "react";
import { motion } from "framer-motion";

const StepWelcome = ({ onNext }) => {
  return (
    <motion.div
      className="text-center p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="fw-bold text-primary mb-3">Smart Menu</h1>
      <p className="text-muted mb-4">
        Welcome to Smart Menu setup wizard. Let’s start by setting up your account and restaurant details.
      </p>
      <button className="btn btn-primary px-5 py-2 rounded-pill" onClick={onNext}>
        Start Setup
      </button>
    </motion.div>
  );
};

export default StepWelcome;
