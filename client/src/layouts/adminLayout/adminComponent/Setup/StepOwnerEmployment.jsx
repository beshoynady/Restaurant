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

  const handleChange = (e, field, langKey) => {
    const { name, value } = e.target;
    if (field && langKey) {
      setForm((prev) => ({
        ...prev,
        [field]: { ...prev[field], [langKey]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert(
        lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match!"
      );
      return;
    }
    onNext();
  };

  // تحديد اللغة والمظهر
  const isDark = theme === "dark";
  const isArabic = lang === "ar";

  return (
    <motion.form
      onSubmit={handleSubmit}
      dir={isArabic ? "rtl" : "ltr"}
      className={`container my-5 p-5 rounded-4 shadow-lg border transition-all duration-300
        ${
          isDark
            ? "bg-dark text-light border-secondary"
            : "bg-white text-dark border-light"
        }
        ${isArabic ? "text-end" : "text-start"}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2
        className={`text-center fw-bold mb-4 ${
          isDark ? "text-info" : "text-primary"
        }`}
      >
        👤 {isArabic ? "بيانات المالك" : "Owner Information"}
      </h2>

      <div className="row g-4">
        {/* Full Name EN */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "الاسم بالكامل (إنجليزي)" : "Full Name (EN)"}
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={form.fullName.en}
            onChange={(e) => handleChange(e, "fullName", "en")}
            placeholder={
              isArabic ? "ادخل الاسم بالإنجليزية" : "Enter full name in English"
            }
            required
          />
        </div>

        {/* Full Name AR */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "الاسم بالكامل (عربي)" : "Full Name (AR)"}
          </label>
          <input
            type="text"
            dir="rtl"
            className="form-control form-control-lg"
            value={form.fullName.ar}
            onChange={(e) => handleChange(e, "fullName", "ar")}
            placeholder={
              isArabic ? "ادخل الاسم بالعربية" : "Enter full name in Arabic"
            }
            required
          />
        </div>

        {/* Gender */}
        <div className="col-md-6">
          <label className="form-label">{isArabic ? "النوع" : "Gender"}</label>
          <select
            name="gender"
            className="form-select form-select-lg"
            value={form.gender}
            onChange={handleChange}
            required
          >
            <option value="">
              {isArabic ? "اختر النوع" : "Select Gender"}
            </option>
            <option value="male">{isArabic ? "👨 ذكر" : "👨 Male"}</option>
            <option value="female">{isArabic ? "👩 أنثى" : "👩 Female"}</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "تاريخ الميلاد" : "Date of Birth"}
          </label>
          <input
            type="date"
            name="dateOfBirth"
            className="form-control form-control-lg"
            value={form.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        {/* National ID */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "الرقم القومي" : "National ID"}
          </label>
          <input
            type="text"
            name="nationalID"
            className="form-control form-control-lg"
            value={form.nationalID}
            onChange={handleChange}
            placeholder={
              isArabic ? "ادخل الرقم القومي" : "Enter your National ID"
            }
            required
          />
        </div>

        {/* Nationality */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "الجنسية" : "Nationality"}
          </label>
          <input
            type="text"
            name="nationality"
            className="form-control form-control-lg"
            value={form.nationality}
            onChange={handleChange}
            placeholder={isArabic ? "ادخل الجنسية" : "Enter nationality"}
          />
        </div>

        {/* Username */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "اسم المستخدم" : "Username"}
          </label>
          <input
            type="text"
            name="username"
            className="form-control form-control-lg"
            value={form.username}
            onChange={handleChange}
            placeholder={isArabic ? "اختر اسم المستخدم" : "Choose a username"}
            required
          />
        </div>

        {/* Password */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "كلمة المرور" : "Password"}
          </label>
          <input
            type="password"
            name="password"
            className="form-control form-control-lg"
            value={form.password}
            onChange={handleChange}
            placeholder={isArabic ? "ادخل كلمة المرور" : "Enter password"}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="form-control form-control-lg"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder={
              isArabic ? "أعد كتابة كلمة المرور" : "Re-enter password"
            }
            required
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-5">
        <motion.button
          type="button"
          className={`btn btn-lg px-4 ${
            isDark ? "btn-outline-light" : "btn-outline-secondary"
          }`}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
        >
          ⬅ {isArabic ? "رجوع" : "Back"}
        </motion.button>

        <motion.button
          type="submit"
          className={`btn btn-lg px-4 ${isDark ? "btn-info" : "btn-primary"}`}
          whileTap={{ scale: 0.95 }}
        >
          {isArabic ? "التالي" : "Next"} ➡
        </motion.button>
      </div>
    </motion.form>
  );
};

export default StepOwnerEmployment;
