const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const patientSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
      required: [true, "Nama tidak boleh kosong"],
      trim: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Nama tidak boleh kosong",
      },
    },
    age: {
      type: Number,
      required: [true, "Umur tidak boleh kosong"],
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: "Umur harus lebih dari 0",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Nomor telepon tidak boleh kosong"],
      trim: true,
      validate: [
        {
          validator: function (v) {
            return v && v.length > 0;
          },
          message: "Nomor telepon tidak boleh kosong",
        },
        {
          validator: function (v) {
            const phoneRegex = /^(62|0)\d{8,13}$/;
            return phoneRegex.test(v);
          },
          message:
            "Format nomor telepon tidak valid. Harus dimulai dengan 62 atau 0, minimal 10 digit dan maksimal 15 digit",
        },
      ],
    },
    address: {
      type: String,
      required: [true, "Alamat tidak boleh kosong"],
      trim: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Alamat tidak boleh kosong",
      },
    },
    complaint: {
      type: String,
      required: [true, "Keluhan tidak boleh kosong"],
      trim: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Keluhan tidak boleh kosong",
      },
    },
    isPatientSameWithUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        return {
          id: ret._id,
          name: ret.name,
          age: ret.age,
          phoneNumber: ret.phoneNumber,
          address: ret.address,
          complaint: ret.complaint,
          isPatientSameWithUser: ret.isPatientSameWithUser,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
  }
);

module.exports = mongoose.model("Patient", patientSchema);
