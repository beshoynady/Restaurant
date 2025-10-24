import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

const StepOwnerEmployment = ({ onNext, onBack, lang, theme, apiUrl }) => {
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

  const matchPasswords = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.warning(
        lang === "ar" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match!"
      );
      return;
    }
    onNext();
  };

  const isDark = theme === "dark";
  const isArabic = lang === "ar";

  const handleCreateOwner = async (e) => {
    e.preventDefault();
    matchPasswords();
    // Function to create owner using the collected data
    try {
      const ownerData = {
        fullNameEn: form.fullName.en,
        fullNameAr: form.fullName.ar,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        nationalID: form.nationalID,
        nationality: form.nationality,
        username: form.username,
        password: form.password,
      };
      // Here you would typically send ownerData to your backend API
      const newOwner = await axios.post(
        `${apiUrl}/api/employee/create-first`,
        ownerData
      );
      if (newOwner) {
        toast.success(
          isArabic
            ? "تم انشاء بيانات المالك بنجاح"
            : "Owner details created successfully"
        );
      }
    } catch (error) {
      console.error("Error creating owner:", error);
      toast.error(
        isArabic
          ? "حدث خطأ أثناء انشاء بيانات المالك"
          : "An error occurred while creating owner details"
      );
    }
  };

  return (
    <motion.form
      onSubmit={handleCreateOwner}
      dir={isArabic ? "rtl" : "ltr"}
      className={`container my-2 p-2 rounded-4 shadow-lg border transition-all duration-300
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
      <motion.h2
        initial={{ opacity: 0, y: -15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className={`text-center fw-bold mb-3 tracking-wide relative ${
          isDark
            ? "text-info drop-shadow-[0_0_8px_rgba(91,192,222,0.6)]"
            : "text-primary drop-shadow-[0_0_6px_rgba(0,123,255,0.4)]"
        }`}
      >
        <span className="inline-block animate-pulse mr-2">👤</span>
        <span
          className={`relative ${
            isDark ? "after:bg-info/40" : "after:bg-primary/30"
          } after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:rounded-full`}
        >
          {isArabic ? "بيانات المالك" : "Owner Information"}
        </span>
      </motion.h2>

      <div className="row g-4">
        {/* Full Name EN */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "الاسم بالكامل (إنجليزي)" : "Full Name (EN)"}
          </label>
          <input
            type="text"
            className="form-control form-control"
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
            className="form-control form-control"
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
          <label
            className="form-label fw-semibold mb-2"
          >
            {isArabic ? "النوع" : "Gender"}
          </label>

          <select
            name="gender"
            className={`form-select form-select w-100 rounded-4 py-2 px-3 shadow-sm border-0 ${
              isDark
                ? "bg-gray-800 text-light border-gray-700 focus:bg-gray-700"
                : "bg-white text-dark border border-gray-300 focus:border-primary"
            } transition-all`}
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
            className="form-control form-control"
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
            className="form-control form-control"
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
            className="form-control form-control"
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
            className="form-control form-control"
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
            className="form-control form-control"
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
            className="form-control form-control"
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
      <div className="d-flex justify-content-between mt-2">
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
