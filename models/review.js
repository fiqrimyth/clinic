const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const reviewSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    doctorId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userPhoto: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        return {
          id: ret._id,
          doctorId: ret.doctorId,
          userId: ret.userId,
          rating: ret.rating,
          comment: ret.comment,
          userName: ret.userName,
          userPhoto: ret.userPhoto,
          createdAt: ret.createdAt,
        };
      },
    },
  }
);

module.exports = mongoose.model("Review", reviewSchema);
