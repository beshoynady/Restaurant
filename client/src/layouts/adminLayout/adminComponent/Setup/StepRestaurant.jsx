import React, { useState } from "react";
import { motion } from "framer-motion";

const StepRestaurant = ({ onNext, onBack }) => {
  const [restaurant, setRestaurant] = useState({
    brandName: { en: "", ar: "" },
    description: { en: "", ar: "" },
    logo: null,
    coverImage: null,
    aboutText: { en: "", ar: "" },
  });

  const handleChange = (e, key, lang) => {
    if (key === "brandName" || key === "description" || key === "aboutText") {
      setRestaurant({
        ...restaurant,
        [key]: { ...restaurant[key], [lang]: e.target.value },
      });
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

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-green-600 dark:text-green-400">
        🏢 Restaurant Details
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Brand Names */}
        <div>
          <label className="font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Brand Name (EN)
          </label>
          <input
            type="text"
            className="input-style"
            value={restaurant.brandName.en}
            onChange={(e) => handleChange(e, "brandName", "en")}
            placeholder="Enter restaurant name in English"
            required
          />
        </div>

        <div>
          <label className="font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Brand Name (AR)
          </label>
          <input
            type="text"
            dir="rtl"
            className="input-style"
            value={restaurant.brandName.ar}
            onChange={(e) => handleChange(e, "brandName", "ar")}
            placeholder="ادخل اسم المطعم بالعربية"
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Description (EN)
          </label>
          <textarea
            className="input-style min-h-[100px]"
            value={restaurant.description.en}
            onChange={(e) => handleChange(e, "description", "en")}
            placeholder="Write a short English description about your restaurant"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-medium text-gray-700 dark:text-gray-300 mb-1 block">
            Description (AR)
          </label>
          <textarea
            dir="rtl"
            className="input-style min-h-[100px]"
            value={restaurant.description.ar}
            onChange={(e) => handleChange(e, "description", "ar")}
            placeholder="اكتب وصفًا قصيرًا عن المطعم"
            required
          />
        </div>

        {/* Upload Logo */}
        <div className="flex flex-col items-center gap-2">
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Logo
          </label>
          <div className="relative flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              id="logo-upload"
              onChange={(e) => handleFile(e, "logo")}
              className="hidden"
            />
            <label
              htmlFor="logo-upload"
              className="cursor-pointer px-4 py-2 bg-blue-100 dark:bg-gray-700 rounded-xl hover:bg-blue-200 dark:hover:bg-gray-600 transition"
            >
              📁 Upload Logo
            </label>
            {restaurant.logo && (
              <img
                src={URL.createObjectURL(restaurant.logo)}
                alt="Logo Preview"
                className="w-24 h-24 mt-3 object-cover rounded-full border shadow-sm"
              />
            )}
          </div>
        </div>

        {/* Upload Cover */}
        <div className="flex flex-col items-center gap-2">
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Cover Image
          </label>
          <div className="relative flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              id="cover-upload"
              onChange={(e) => handleFile(e, "coverImage")}
              className="hidden"
            />
            <label
              htmlFor="cover-upload"
              className="cursor-pointer px-4 py-2 bg-green-100 dark:bg-gray-700 rounded-xl hover:bg-green-200 dark:hover:bg-gray-600 transition"
            >
              🖼️ Upload Cover
            </label>
            {restaurant.coverImage && (
              <img
                src={URL.createObjectURL(restaurant.coverImage)}
                alt="Cover Preview"
                className="w-full max-h-32 mt-3 object-cover rounded-xl border shadow-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
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
          className="btn-primary bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
          whileTap={{ scale: 0.95 }}
        >
          Finish ✅
        </motion.button>
      </div>
    </motion.form>
  );
};

export default StepRestaurant;
