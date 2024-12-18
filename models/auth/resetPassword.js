const mongoose = require("mongoose");

const resetPasswordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  expiredAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 3600000), // 1 jam dari sekarang
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index untuk pencarian
resetPasswordSchema.index({ token: 1 });
resetPasswordSchema.index({ email: 1 });
resetPasswordSchema.index({ expiredAt: 1 });

// Method untuk cek token expired
resetPasswordSchema.methods.isExpired = function () {
  return Date.now() >= this.expiredAt;
};

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = ResetPassword;
