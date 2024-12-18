const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const specialistSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        return {
          id: ret._id,
          title: ret.title,
        };
      },
    },
  }
);

module.exports = mongoose.model("Specialist", specialistSchema);
