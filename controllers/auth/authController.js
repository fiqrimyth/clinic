const User = require("../../models/auth/login");
const ResetPassword = require("../../models/auth/resetPassword");
const ResponseWrapper = require("../../utils/responseWrapper");
const logger = require("../../utils/logger");
const crypto = require("crypto");

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn("Registrasi gagal - Email sudah terdaftar", {
        email,
        deviceId,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
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

    const token = user.generateAuthToken();
    return ResponseWrapper.success(
      res,
      "Registrasi berhasil",
      { token, user },
      201
    );
  } catch (error) {
    logger.error("Error saat registrasi", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    return ResponseWrapper.error(res, "Gagal melakukan registrasi", error);
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      logger.warn("Login gagal - User tidak ditemukan", { email });
      return ResponseWrapper.notFound(res, "Email atau password salah");
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn("Login gagal - Password salah", { email });
      return ResponseWrapper.unauthorized(res, "Email atau password salah");
    }

    user.deviceId = deviceId;
    user.lastLogin = new Date();
    await user.save();

    const token = user.generateAuthToken();
    return ResponseWrapper.success(res, "Login berhasil", { token, user });
  } catch (error) {
    logger.error("Error saat login", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    return ResponseWrapper.error(res, "Gagal melakukan login", error);
  }
};

// Social login/register
exports.socialLogin = async (req, res) => {
  try {
    const { email, deviceId, socialId, loginMethod } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        deviceId,
        socialId,
        registrationMethod: loginMethod,
        isActive: true,
      });
      await user.save();
    } else {
      user.deviceId = deviceId;
      user.lastLogin = new Date();
      if (!user.socialId) user.socialId = socialId;
      await user.save();
    }

    const token = user.generateAuthToken();
    return ResponseWrapper.success(res, "Social login berhasil", {
      token,
      user,
    });
  } catch (error) {
    logger.error("Error saat social login", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    return ResponseWrapper.error(res, "Gagal melakukan social login", error);
  }
};

// Change password (untuk user yang sudah login)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return ResponseWrapper.badRequest(res, "Password saat ini tidak sesuai");
    }

    user.password = newPassword;
    await user.save();

    logger.info("Password berhasil diubah", {
      userId: user.id,
      time: new Date(),
    });

    return ResponseWrapper.success(res, "Password berhasil diubah");
  } catch (error) {
    logger.error("Error saat ganti password", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    return ResponseWrapper.error(res, "Gagal mengubah password", error);
  }
};

// Request reset password (untuk user yang lupa password)
exports.requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return ResponseWrapper.notFound(res, "Email tidak terdaftar");
    }

    // Generate token untuk reset password
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Simpan token ke database dengan expiry time
    await ResetPassword.create({
      userId: user.id,
      email: user.email,
      token: resetToken,
      expiredAt: new Date(Date.now() + 3600000), // 1 jam
    });

    // Kirim email dengan link reset password
    await sendResetPasswordEmail(user.email, resetToken);

    logger.info("Request reset password berhasil", {
      userId: user.id,
      email: user.email,
      token: resetToken,
      time: new Date(),
    });

    return ResponseWrapper.success(
      res,
      "Link reset password telah dikirim ke email"
    );
  } catch (error) {
    logger.error("Error saat request reset password", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    return ResponseWrapper.error(res, "Gagal memproses reset password", error);
  }
};

// Reset password dengan token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Cari token yang valid
    const resetData = await ResetPassword.findOne({
      token,
      isUsed: false,
      expiredAt: { $gt: new Date() },
    });

    if (!resetData) {
      return ResponseWrapper.badRequest(
        res,
        "Token reset password tidak valid atau sudah expired"
      );
    }

    // Update password user
    const user = await User.findById(resetData.userId);
    if (!user) {
      return ResponseWrapper.notFound(res, "User tidak ditemukan");
    }

    user.password = newPassword;
    await user.save();

    // Tandai token sudah digunakan
    resetData.isUsed = true;
    await resetData.save();

    logger.info("Reset password berhasil", {
      userId: user.id,
      email: user.email,
      time: new Date(),
    });

    return ResponseWrapper.success(res, "Password berhasil direset");
  } catch (error) {
    logger.error("Error saat reset password", {
      error: error.message,
      stack: error.stack,
      body: req.body,
    });
    return ResponseWrapper.error(res, "Gagal mereset password", error);
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    // Implementasi logout (misal: blacklist token)
    return ResponseWrapper.success(res, "Logout berhasil");
  } catch (error) {
    logger.error("Error saat logout", {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id,
    });
    return ResponseWrapper.error(res, "Gagal melakukan logout", error);
  }
};
