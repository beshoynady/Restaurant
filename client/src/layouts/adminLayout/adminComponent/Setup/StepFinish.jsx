import React from "react";
import { motion } from "framer-motion";

const StepFinish = () => {
  return (
    <motion.div
      className="text-center p-5 bg-light rounded shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-success fw-bold mb-3">Setup Completed 🎉</h3>
      <p className="text-muted mb-4">
        Your restaurant and admin account are now ready. You can start using Smart Menu.
      </p>
      <button className="btn btn-primary px-5 py-2 rounded-pill">
        Go to Dashboard
      </button>
    </motion.div>
  );
};

export default StepFinish;
