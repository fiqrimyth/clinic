const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const deliverySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  deliveryType: {
    type: String,
    enum: ["Bebas Ongkir", "Gojek", "Grab", "Reguler", "Kargo", "Ekonomi"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  estimatedArrival: {
    type: Date,
    required: true,
  },
  weightLimit: {
    type: Number,
    default: null, // untuk kasus Kargo yang ada batas berat di atas 5kg
  },
  isInstant: {
    type: Boolean,
    default: false, // untuk Gojek/Grab yang same-day delivery
  },
});

module.exports = mongoose.model("Delivery", deliverySchema);
