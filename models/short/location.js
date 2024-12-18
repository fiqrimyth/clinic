const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const locationSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    location: {
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
          location: ret.location,
        };
      },
    },
  }
);

module.exports = mongoose.model("Location", locationSchema);
