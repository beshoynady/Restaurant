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

  const handleChange = (e, key, lang) => {
    if (key === "fullName") {
      setForm({
        ...form,
        fullName: { ...form.fullName, [lang]: e.target.value },
      });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 dark:text-blue-400">
        👤 Owner Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Full Name (EN)
          </label>
          <input
            type="text"
            className="input-style"
            value={form.fullName.en}
            onChange={(e) => handleChange(e, "fullName", "en")}
            placeholder="Enter full name in English"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Full Name (AR)
          </label>
          <input
            type="text"
            dir="rtl"
            className="input-style"
            value={form.fullName.ar}
            onChange={(e) => handleChange(e, "fullName", "ar")}
            placeholder="ادخل الاسم بالكامل بالعربية"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Gender
          </label>
          <select
            name="gender"
            className="input-style"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">👨 Male</option>
            <option value="female">👩 Female</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            className="input-style"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            National ID
          </label>
          <input
            type="text"
            name="nationalID"
            className="input-style"
            value={form.nationalID}
            onChange={handleChange}
            placeholder="Enter your National ID"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Nationality
          </label>
          <input
            type="text"
            name="nationality"
            className="input-style"
            value={form.nationality}
            onChange={handleChange}
            placeholder="Enter nationality"
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input
            type="text"
            name="username"
            className="input-style"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="input-style"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="font-medium mb-1 text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="input-style"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            required
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <motion.button
          type="button"
          className="btn-secondary"
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
        >
          ⬅ Back
        </motion.button>

        <motion.button
          type="submit"
          className="btn-primary"
          whileTap={{ scale: 0.95 }}
        >
          Next ➡
        </motion.button>
      </div>
    </motion.form>
  );
};

export default StepOwnerEmployment;
