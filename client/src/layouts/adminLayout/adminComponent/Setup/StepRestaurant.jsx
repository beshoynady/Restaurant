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
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">
        🏢 Restaurant Details
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Brand Name (EN)</label>
          <input
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.brandName.en}
            onChange={(e) => handleChange(e, "brandName", "en")}
            required
          />
        </div>

        <div>
          <label className="font-medium">Brand Name (AR)</label>
          <input
            dir="rtl"
            type="text"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.brandName.ar}
            onChange={(e) => handleChange(e, "brandName", "ar")}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="font-medium">Description (EN)</label>
          <textarea
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.description.en}
            onChange={(e) => handleChange(e, "description", "en")}
            required
          />
        </div>

        <div className="col-span-2">
          <label className="font-medium">Description (AR)</label>
          <textarea
            dir="rtl"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.description.ar}
            onChange={(e) => handleChange(e, "description", "ar")}
            required
          />
        </div>

        <div>
          <label className="font-medium">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e, "logo")}
          />
        </div>

        <div>
          <label className="font-medium">Cover Image</label>
          <input
            type="file"
            accept="image/*"
            // onChange={(e) => handleFile(e, "coverImage")}
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
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Finish
        </button>
      </div>
    </motion.form>
  );
};

export default StepRestaurant;
