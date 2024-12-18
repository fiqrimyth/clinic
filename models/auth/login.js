const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
      required: function () {
        return this.registrationMethod !== "email";
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.registrationMethod === "email";
      },
    },
    deviceId: {
      type: String,
      required: true,
    },
    registrationMethod: {
      type: String,
      enum: ["email", "google", "facebook"],
      required: true,
    },
    socialId: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return {
          id: ret._id,
          email: ret.email,
          name: ret.name || undefined,
          role: ret.role,
          deviceId: ret.deviceId,
          registrationMethod: ret.registrationMethod,
          socialId: ret.socialId || undefined,
          isActive: ret.isActive,
          lastLogin: ret.lastLogin,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
          isAdmin: ret.isAdmin,
        };
      },
      versionKey: false,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      deviceId: this.deviceId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d", // Token berlaku 7 hari
    }
  );
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
