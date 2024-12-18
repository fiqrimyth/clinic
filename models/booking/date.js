const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const dateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    day: {
      type: String,
      required: true,
      enum: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    },
    tanggal: {
      type: String, // Format: ddMMMyyyy (contoh: 01Jan2024)
      required: true,
    },
    startTime: {
      type: String, // Format waktu (contoh: "09:00")
      required: true,
    },
    endTime: {
      type: String, // Format waktu (contoh: "17:00")
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        return {
          id: ret._id,
          day: ret.day,
          tanggal: ret.tanggal,
          startTime: ret.startTime,
          endTime: ret.endTime,
          createdAt: ret.createdAt,
          updatedAt: ret.updatedAt,
        };
      },
    },
  }
);

module.exports = mongoose.model("Date", dateSchema);
