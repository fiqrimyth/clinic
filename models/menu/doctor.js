const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const experienceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    title: String,
    place: String,
    startYear: Number,
    endYear: Number,
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        const ordered = {
          id: ret._id,
          title: ret.title,
          place: ret.place,
          startYear: ret.startYear,
          endYear: ret.endYear,
        };
        return ordered;
      },
    },
  }
);

const doctorSchema = new mongoose.Schema(
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
    hospital: {
      type: String,
      required: true,
    },
    imageUrl: String,
    rating: {
      type: Number,
      default: 0,
    },
    description: String,
    locationMapUrl: String,
    excellentCount: {
      type: Number,
      default: 0,
    },
    goodCount: {
      type: Number,
      default: 0,
    },
    averageCount: {
      type: Number,
      default: 0,
    },
    badCount: {
      type: Number,
      default: 0,
    },
    tooBadCount: {
      type: Number,
      default: 0,
    },
    experiences: [experienceSchema],
    consultationPrice: {
      type: Number,
      required: true,
    },
    reviews: [
      {
        type: String,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const ordered = {
          id: ret._id,
          name: ret.name,
          specialist: ret.specialist,
          hospital: ret.hospital,
          imageUrl: ret.imageUrl,
          rating: ret.rating,
          description: ret.description,
          locationMapUrl: ret.locationMapUrl,
          excellentCount: ret.excellentCount,
          goodCount: ret.goodCount,
          averageCount: ret.averageCount,
          badCount: ret.badCount,
          tooBadCount: ret.tooBadCount,
          experiences: ret.experiences,
          consultationPrice: ret.consultationPrice,
          reviews: ret.reviews,
        };
        return ordered;
      },
    },
  }
);

module.exports = mongoose.model("Doctor", doctorSchema);
