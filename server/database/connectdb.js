const mongoose = require('mongoose');
const dotenv = require('dotenv');

// 🟡 تحميل متغيرات البيئة
dotenv.config();

// 🟢 قراءة URL من ملف .env
const mongoURL = process.env.MONGODB_URL;

// 🧠 دالة الاتصال بقاعدة البيانات
const connectDB = async () => {
  try {
    console.log(`🔌 Connecting to MongoDB at ${mongoURL} ...`);

    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 ثانية لاختيار السيرفر
      connectTimeoutMS: 10000,         // 10 ثوانٍ لبدء الاتصال
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // إعادة المحاولة بعد 5 ثواني
    setTimeout(connectDB, 5000);
  }
};

// 📤 تصدير الدالة
module.exports = connectDB;
