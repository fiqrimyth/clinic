const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Clinic", "Baby Spa"],
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    doctorName: {
      type: String,
      required: function () {
        return this.type === "Clinic";
      },
    },
    specialization: {
      type: String,
      required: function () {
        return this.type === "Clinic";
      },
    },
    serviceName: {
      type: String,
      required: function () {
        return this.type === "Baby Spa";
      },
    },
    status: {
      type: String,
      enum: ["On Progress", "Completed", "Cancelled"],
      default: "On Progress",
    },
    total: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const ordered = {
          id: ret._id,
          type: ret.type,
          date: ret.date,
          location: ret.location,
          doctorName: ret.doctorName,
          specialization: ret.specialization,
          serviceName: ret.serviceName,
          status: ret.status,
          total: ret.total,
          userId: ret.userId,
        };
        return ordered;
      },
    },
  }
);

module.exports = mongoose.model("History", historySchema);
