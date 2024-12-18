const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bookmarkSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    isBookmarked: {
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
          isBookmarked: ret.isBookmarked,
        };
      },
    },
  }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);
