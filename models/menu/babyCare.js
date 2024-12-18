const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const babyCareSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    name: {
      type: String,
      required: true,
    },
    specialist: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      required: true,
    },
    babySpa: [
      {
        package: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        total: {
          type: String,
          required: true,
        },
        discount: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        isSelected: {
          type: Boolean,
          default: false,
        },
      },
    ],
    price: {
      type: String,
      required: true,
    },
    hospital: {
      type: String,
      required: true,
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
        const ordered = {
          id: ret._id,
          name: ret.name,
          specialist: ret.specialist,
          photo: ret.photo,
          experience: ret.experience,
          rating: ret.rating,
          about: ret.about,
          price: ret.price,
          hospital: ret.hospital,
          isBookmarked: ret.isBookmarked,
        };
        return ordered;
      },
    },
  }
);

module.exports = mongoose.model("BabyCare", babyCareSchema);
