const User = require("../../models/auth/login");
const ResponseWrapper = require("../../utils/responseWrapper");
const logger = require("../../utils/logger");

// Get semua users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    console.log("Users found:", users);

    if (!users) {
      return ResponseWrapper.error(res, "Tidak ada data users");
    }

    return ResponseWrapper.success(res, users, "Data users berhasil diambil");
  } catch (error) {
    console.log("Error detail:", error);
    logger.error("Error saat mengambil data users", {
      error: error.message,
      stack: error.stack,
    });
    return ResponseWrapper.error(
      res,
      error.message,
      "Gagal mengambil data users"
    );
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return ResponseWrapper.notFound(res, "User tidak ditemukan");
    }
    return ResponseWrapper.success(res, user, "Data users berhasil diambil");
  } catch (error) {
    logger.error("Error saat mengambil data user", {
      error: error.message,
      stack: error.stack,
      userId: req.params.id,
    });
    return ResponseWrapper.error(
      res,
      error.message,
      "Gagal mengambil data user"
    );
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("Gagal membuat user - Email sudah terdaftar", { email });
      return ResponseWrapper.badRequest(res, "Email sudah terdaftar");
    }

    const user = new User({
      email,
      password,
      deviceId,
      registrationMethod: "email",
      isActive: true,
    });
    await user.save();

    logger.info("User baru berhasil dibuat", {
      userId: user.id,
      email: user.email,
    });

    return ResponseWrapper.success(res, user, "User berhasil dibuat", 201);
  } catch (error) {
    logger.error("Error saat membuat user", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    return ResponseWrapper.error(res, error.message, "Gagal membuat user");
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Password tidak bisa diupdate lewat sini

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return ResponseWrapper.notFound(res, "User tidak ditemukan");
    }

    logger.info("User berhasil diupdate", {
      userId: user.id,
      updates: req.body,
    });

    return ResponseWrapper.success(res, user, "User berhasil diupdate");
  } catch (error) {
    logger.error("Error saat update user", {
      error: error.message,
      stack: error.stack,
      userId: req.params.id,
      updates: req.body,
    });
    return ResponseWrapper.error(res, error.message, "Gagal mengupdate user");
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    console.log("Mencoba menghapus user dengan ID:", req.params.id);

    // Gunakan findOneAndDelete sebagai alternatif
    const user = await User.findOneAndDelete({ _id: req.params.id });
    console.log("Hasil query delete:", user);

    if (!user) {
      console.log("User tidak ditemukan");
      return ResponseWrapper.notFound(res, "User tidak ditemukan");
    }

    logger.info("User berhasil dihapus", {
      userId: user.id,
      email: user.email,
    });

    return ResponseWrapper.success(res, "User berhasil dihapus");
  } catch (error) {
    console.log("Error detail:", error);
    logger.error("Error saat menghapus user", {
      error: error.message,
      stack: error.stack,
      userId: req.params.id,
    });
    return ResponseWrapper.error(res, error.message, "Gagal menghapus user");
  }
};

// Delete all user
exports.clearCollection = async (req, res) => {
  console.log("Masuk ke controller clearCollection");
  try {
    console.log("Mencoba menghapus user...");
    const result = await User.deleteMany({});
    console.log("Hasil delete:", result);
    return ResponseWrapper.success(res, "Semua user berhasil dihapus");
  } catch (error) {
    console.error("Error dalam clearCollection:", error);
    return ResponseWrapper.error(
      res,
      error.message,
      "Gagal menghapus semua user"
    );
  }
};
