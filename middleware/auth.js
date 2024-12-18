const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/auth/blacklistedToken");
const User = require("../models/auth/login");
const ResponseWrapper = require("../utils/responseWrapper");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    // Cek apakah token ada di blacklist
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      throw new Error("Token tidak valid");
    }

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek apakah user masih ada dan aktif
    const user = await User.findOne({
      _id: decoded.userId,
      isActive: true,
    });

    if (!user) {
      throw new Error("User tidak ditemukan");
    }

    req.token = token;
    req.user = user;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return ResponseWrapper.unauthorized(
      res,
      "Silakan login terlebih dahulu",
      error.message
    );
  }
};

module.exports = auth;
