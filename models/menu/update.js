const mongoose = require("mongoose");

const updateSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    type: {
      type: String,
      required: true,
      enum: ["Clinic", "Baby Spa", "Doctor", "Information"],
    },
    date: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    transactionNumber: {
      type: String,
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
          title: ret.title,
          description: ret.description,
          transactionNumber: ret.transactionNumber,
        };
        return ordered;
      },
    },
  }
);

module.exports = mongoose.model("Update", updateSchema);
