require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/auth/login");
const { v4: uuidv4 } = require("uuid");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Cek apakah sudah ada admin
    const existingAdmin = await User.findOne({ isAdmin: true });
    if (existingAdmin) {
      console.log("Admin sudah ada:", existingAdmin.email);
      process.exit(0);
    }

    // Buat admin baru
    const admin = new User({
      email: process.env.ADMIN_EMAIL || "developer.ramadhan@gmail.com",
      password: process.env.ADMIN_PASSWORD || "Szherazade@123",
      deviceId: uuidv4(),
      registrationMethod: "email",
      isAdmin: true,
      isActive: true,
    });

    await admin.save();
    console.log("Admin berhasil dibuat:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("Error saat membuat admin:", error);
    process.exit(1);
  }
};

createAdmin();
