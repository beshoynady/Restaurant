import React, { useState } from "react";
import { motion } from "framer-motion";

const StepRestaurant = ({ onNext, onBack }) => {
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    phone: "",
    currency: "EGP",
  });

  const handleChange = (e) => setRestaurant({ ...restaurant, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-sm bg-white"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="text-primary mb-3">Restaurant Information</h4>
      <div className="mb-3">
        <label className="form-label fw-semibold">Restaurant Name</label>
        <input type="text" name="name" className="form-control" required onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Address</label>
        <input type="text" name="address" className="form-control" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Phone</label>
        <input type="text" name="phone" className="form-control" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Currency</label>
        <select name="currency" className="form-select" onChange={handleChange}>
          <option value="EGP">EGP</option>
          <option value="USD">USD</option>
          <option value="SAR">SAR</option>
          <option value="AED">AED</option>
        </select>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-success">Finish</button>
      </div>
    </motion.form>
  );
};

export default StepRestaurant;
