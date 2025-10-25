import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

/**
 * StepRestaurant Component
 * Collects restaurant details during setup wizard
 */

const StepRestaurant = ({ onNext, onBack, lang, theme, apiUrl }) => {


  const [restaurant, setRestaurant] = useState({
    brandName: { en: "", ar: "" },
    description: { en: "", ar: "" },
    logo: null,
    coverImage: null,
  });

  const handleChange = (e, key, value) => {
    if (key === "brandName" || key === "description" || key === "aboutText") {
      setRestaurant((prev) => ({
        ...prev,
        [key]: { ...prev[key], [value]: e.target.value },
      }));
    } else {
      setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
    }
  };

  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if (file) setRestaurant({ ...restaurant, [field]: file });
  };

  const isDark = theme === "dark";
  const isArabic = lang === "ar";

  const createRestaurant = async (e) => {
    e.preventDefault();
    // Function to create restaurant using the collected data
    try {
      const formData = {
        brandName: {
          en: restaurant.brandName.en,
          ar: restaurant.brandName.ar,
        },
        description: {
          en: restaurant.description.en,
          ar: restaurant.description.ar,
        },
        logo: restaurant.logo ? restaurant.logo : null,
        coverImage: restaurant.coverImage ? restaurant.coverImage : null,
      };

      // Here you would typically send formData to your backend API
      const newRestaurant = await axios.post(
        `${apiUrl}/api/restaurant`,
        config,
        formData
      );
      console.log("Restaurant created successfully:", newRestaurant);
      if (newRestaurant) {
        toast.success(
          isArabic
            ? "تم انشاء بيانات المطعم بنجاح"
            : "Restaurant details created successfully"
        );
        onNext();
      }
    } catch (error) {
      console.error("Error creating restaurant:", error);
      toast.error(
        isArabic
          ? "حدث خطأ أثناء انشاء بيانات المطعم"
          : "An error occurred while creating restaurant details"
      );
    }
  };

  return (
    <motion.form
      onSubmit={createRestaurant}
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
      <motion.h2
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        className={`text-center fw-bold mb-6 tracking-wide ${
          isDark
            ? "text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]"
            : "text-green-600 drop-shadow-[0_0_6px_rgba(34,197,94,0.3)]"
        }`}
      >
        <span className="inline-block animate-pulse mr-2">🏢</span>
        <span
          className={`relative ${
            isDark ? "after:bg-green-400/40" : "after:bg-green-500/30"
          } after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[3px] after:rounded-full`}
        >
          {isArabic ? "بيانات المطعم" : "Restaurant Details"}
        </span>
      </motion.h2>

      <div
        className="row g-4"
        style={{ textAlign: isArabic ? "right" : "left" }}
      >
        {/* Brand Name EN */}
        <div className="col-md-6">
          <label className="form-label">
            {isArabic ? "اسم العلامة التجارية (إنجليزي)" : "Brand Name (EN)"}
          </label>
          <input
            type="text"
            className="form-control form-control"
            value={restaurant.brandName.en}
            onChange={(e) => handleChange(e, "brandName", "en")}
            placeholder={
              isArabic
                ? "ادخل اسم المطعم بالإنجليزية"
                : "Enter restaurant name in English"
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
            className="form-control form-control"
            value={restaurant.brandName.ar}
            onChange={(e) => handleChange(e, "brandName", "ar")}
            placeholder={
              isArabic
                ? "ادخل اسم المطعم بالعربية"
                : "Enter restaurant name in Arabic"
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
            className="form-control form-control"
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
            className="form-control form-control"
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
                style={{
                  width: "100%",
                  maxHeight: "150px",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
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
          className={`btn btn-lg px-4 ${
            isDark ? "btn-success" : "btn-success"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          {isArabic ? "إنهاء" : "Finish"} ✅
        </motion.button>
      </div>
    </motion.form>
  );
};

export default StepRestaurant;
