import React, { useState } from "react";
import { motion } from "framer-motion";

const StepOwnerEmployment = ({ onNext, onBack }) => {
  const [form, setForm] = useState({
    fullName: { en: "", ar: "" },
    gender: "",
    dateOfBirth: "",
    nationalID: "",
    nationality: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        👤 Owner Information
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Full Name (EN)</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.fullName.en}
            onChange={(e) => handleChange(e, "fullName", "en")}
            required
          />
        </div>

        <div>
          <label className="font-medium">Full Name (AR)</label>
          <input
            type="text"
            dir="rtl"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.fullName.ar}
            onChange={(e) => handleChange(e, "fullName", "ar")}
            required
          />
        </div>

        <div>
          <label className="font-medium">Gender</label>
          <select
            name="gender"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="font-medium">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-medium">National ID</label>
          <input
            type="text"
            name="nationalID"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.nationalID}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-medium">Nationality</label>
          <input
            type="text"
            name="nationality"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.nationality}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="font-medium">Username</label>
          <input
            type="text"
            name="username"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="font-medium">Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-300 rounded dark:bg-gray-600"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </motion.form>
  );
};

export default StepOwnerEmployment;
