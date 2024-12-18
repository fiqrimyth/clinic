const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const shipmentMedicineSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4(),
    },
    address: {
      type: String,
      required: [true, "Alamat tidak boleh kosong"],
      trim: true,
    },
    medicine: [
      {
        image: {
          type: String,
          required: true,
          trim: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number, // dalam gram
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      required: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
    subtotal: {
      type: Number,
      required: true, // Rp 21.000 di contoh
    },
    deliveryFee: {
      type: Number,
      required: true, // Rp 0 karena bebas ongkir
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: true, // Rp 21.000 (subtotal + deliveryFee - discount)
    },
    status: {
      type: String,
      enum: [
        "pending", // Saat order dibuat, belum dibayar
        "paid", // Setelah pembayaran berhasil
        "processing", // Pesanan sedang diproses/dipacking
        "shipped", // Pesanan sudah dikirim
        "delivered", // Pesanan sudah diterima
        "cancelled", // Pesanan dibatalkan
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ShipmentMedicine", shipmentMedicineSchema);
