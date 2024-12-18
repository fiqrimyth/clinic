require("dotenv").config();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/auth/login");

const migrateToUUID = async () => {
  try {
    // Periksa apakah MONGODB_URI ada
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI tidak ditemukan di environment variables");
    }

    console.log("Connecting to database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database");

    // Ambil semua user
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Update setiap user yang masih menggunakan ObjectId
    for (const user of users) {
      if (user._id.toString().length !== 36) {
        // UUID length adalah 36
        const newId = uuidv4();
        await User.findByIdAndUpdate(user._id, {
          $set: { _id: newId },
        });
        console.log(`Migrated user ${user.email} from ${user._id} to ${newId}`);
      }
    }

    console.log("Migration completed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateToUUID();
