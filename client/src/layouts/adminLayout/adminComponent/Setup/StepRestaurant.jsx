import React, { useState } from "react";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

const StepRestaurant = ({ onNext, onBack, lang, theme }) => {
  const [restaurant, setRestaurant] = useState({
    brandName: { en: "", ar: "" },
    description: { en: "", ar: "" },
    logo: null,
    coverImage: null,
    aboutText: { en: "", ar: "" },
  });

  const handleChange = (e, key, langKey) => {
    if (key === "brandName" || key === "description" || key === "aboutText") {
      setRestaurant((prev) => ({
        ...prev,
        [key]: { ...prev[key], [langKey]: e.target.value },
      }));
    } else {
      setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    }
  };

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (file) setRestaurant({ ...restaurant, [field]: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  // تحديد اللغة والمود
  const isDark = theme === "dark";
  const isArabic = lang === "ar";

  return (
    <motion.form
      onSubmit={handleSubmit}
      dir={isArabic ? "rtl" : "ltr"}
      className={`container my-5 p-5 rounded-4 shadow-lg border transition-all duration-300
        ${isDark ? "bg-dark text-light border-secondary" : "bg-white text-dark border-light"}
        ${isArabic ? "text-end" : "text-start"}`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2
        className={`text-center fw-bold mb-4 ${
          isDark ? "text-success" : "text-success"
        }`}
      >
        🏢 {isArabic ? "بيانات المطعم" : "Restaurant Details"}
      </h2>

      <div className="row g-4">
        {/* Brand Name EN */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "اسم العلامة التجارية (إنجليزي)" : "Brand Name (EN)"}
          </label>
          <input
            type="text"
            className="form-control form-control-lg"
            value={restaurant.brandName.en}
            onChange={(e) => handleChange(e, "brandName", "en")}
            placeholder={
              isArabic ? "ادخل اسم المطعم بالإنجليزية" : "Enter restaurant name in English"
            }
            required
          />
        </div>

        {/* Brand Name AR */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "اسم العلامة التجارية (عربي)" : "Brand Name (AR)"}
          </label>
          <input
            type="text"
            dir="rtl"
            className="form-control form-control-lg"
            value={restaurant.brandName.ar}
            onChange={(e) => handleChange(e, "brandName", "ar")}
            placeholder={
              isArabic ? "ادخل اسم المطعم بالعربية" : "Enter restaurant name in Arabic"
            }
            required
          />
        </div>

        {/* Description EN */}
        <div className="col-12">
          <label className="form-label">
            {isArabic ? "الوصف (إنجليزي)" : "Description (EN)"}
          </label>
          <textarea
            className="form-control form-control-lg"
            style={{ minHeight: "100px" }}
            value={restaurant.description.en}
            onChange={(e) => handleChange(e, "description", "en")}
            placeholder={
              isArabic
                ? "اكتب وصفًا موجزًا عن مطعمك بالإنجليزية"
                : "Write a short English description about your restaurant"
            }
            required
          />
        </div>

        {/* Description AR */}
        <div className="col-12">
          <label className="form-label">
            {isArabic ? "الوصف (عربي)" : "Description (AR)"}
          </label>
          <textarea
            dir="rtl"
            className="form-control form-control-lg"
            style={{ minHeight: "100px" }}
            value={restaurant.description.ar}
            onChange={(e) => handleChange(e, "description", "ar")}
            placeholder={
              isArabic
                ? "اكتب وصفًا موجزًا عن المطعم بالعربية"
                : "Write a short Arabic description about your restaurant"
            }
            required
          />
        </div>

        {/* Upload Logo */}
        <div className="col-md-6 text-center">
          <label className="form-label fw-bold">
            {isArabic ? "شعار المطعم" : "Logo"}
          </label>
          <div className="d-flex flex-column align-items-center">
            <input
              type="file"
              accept="image/*"
              id="logo-upload"
              onChange={(e) => handleFile(e, "logo")}
              className="d-none"
            />
            <label
              htmlFor="logo-upload"
              className={`btn btn-outline-primary rounded-pill px-4 py-2 mt-2 ${
                isDark ? "btn-light text-dark" : ""
              }`}
            >
              📁 {isArabic ? "تحميل الشعار" : "Upload Logo"}
            </label>
            {restaurant.logo && (
              <img
                src={URL.createObjectURL(restaurant.logo)}
                alt="Logo Preview"
                className="rounded-circle border shadow-sm mt-3"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
          </div>
        </div>

        {/* Upload Cover */}
        <div className="col-md-6 text-center">
          <label className="form-label fw-bold">
            {isArabic ? "صورة الغلاف" : "Cover Image"}
          </label>
          <div className="d-flex flex-column align-items-center">
            <input
              type="file"
              accept="image/*"
              id="cover-upload"
              onChange={(e) => handleFile(e, "coverImage")}
              className="d-none"
            />
            <label
              htmlFor="cover-upload"
              className={`btn btn-outline-success rounded-pill px-4 py-2 mt-2 ${
                isDark ? "btn-light text-dark" : ""
              }`}
            >
              🖼️ {isArabic ? "تحميل الغلاف" : "Upload Cover"}
            </label>
            {restaurant.coverImage && (
              <img
                src={URL.createObjectURL(restaurant.coverImage)}
                alt="Cover Preview"
                className="rounded-3 border shadow-sm mt-3"
                style={{ width: "100%", maxHeight: "150px", objectFit: "cover" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between mt-5">
        <motion.button
          type="button"
          className={`btn btn-lg px-4 ${isDark ? "btn-outline-light" : "btn-outline-secondary"}`}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
        >
          ⬅ {isArabic ? "رجوع" : "Back"}
        </motion.button>

        <motion.button
          type="submit"
          className={`btn btn-lg px-4 ${isDark ? "btn-success" : "btn-success"}`}
          whileTap={{ scale: 0.95 }}
        >
          {isArabic ? "إنهاء" : "Finish"} ✅
        </motion.button>
      </div>
    </motion.form>
  );
};

export default StepRestaurant;
