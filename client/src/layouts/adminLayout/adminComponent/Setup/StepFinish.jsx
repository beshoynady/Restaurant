import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const StepFinish = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/login"), 2000);
  }, [navigate]);

  return (
    <motion.div
      className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <h2 className="text-3xl font-bold text-green-600 mb-3">
        ✅ Setup Complete!
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Redirecting you to login...
      </p>
    </motion.div>
  );
};

export default StepFinish;
