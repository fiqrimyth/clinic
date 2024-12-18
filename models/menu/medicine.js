const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const medicineSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    titleMedicine: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    hospital: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    category: {
      type: [String],
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
        return {
          id: ret._id,
          titleMedicine: ret.titleMedicine,
          quantity: ret.quantity,
          price: ret.price,
          hospital: ret.hospital,
          location: ret.location,
          photo: ret.photo,
          condition: ret.condition,
          status: ret.status,
          weight: ret.weight,
          category: ret.category,
          isBookmarked: ret.isBookmarked,
        };
      },
    },
  }
);

module.exports = mongoose.model("Medicine", medicineSchema);
