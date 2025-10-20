import React, { useState } from "react";
import { motion } from "framer-motion";

const StepOwnerEmployment = ({ onNext, onBack }) => {
  const [form, setForm] = useState({
    employeeCode: "",
    hireDate: "",
    contractType: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
      <h4 className="text-primary mb-3">Employment Details</h4>
      <div className="mb-3">
        <label className="form-label fw-semibold">Employee Code</label>
        <input type="text" name="employeeCode" className="form-control" required onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Hire Date</label>
        <input type="date" name="hireDate" className="form-control" required onChange={handleChange} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-semibold">Contract Type</label>
        <select name="contractType" className="form-select" onChange={handleChange} required>
          <option value="">Select Contract Type</option>
          <option value="permanent">Permanent</option>
          <option value="temporary">Temporary</option>
          <option value="part-time">Part Time</option>
        </select>
      </div>

      <div className="d-flex justify-content-between mt-4">
        <button type="button" className="btn btn-outline-secondary" onClick={onBack}>Back</button>
        <button type="submit" className="btn btn-primary">Next</button>
      </div>
    </motion.form>
  );
};

export default StepOwnerEmployment;
