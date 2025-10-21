import React from "react";
import { motion } from "framer-motion";

const StepWelcome = ({ onNext }) => {
  return (
    <motion.div
      className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Smart Menu</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Welcome to Smart Menu setup wizard. Let's start configuring your restaurant and owner account.
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
        onClick={onNext}
      >
        Start Setup
      </button>
    </motion.div>
  );
};

export default StepWelcome;
