const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const shortSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    title: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
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
          title: ret.title,
          rating: ret.rating,
          location: ret.location,
        };
      },
    },
  }
);

module.exports = mongoose.model("Short", shortSchema);
