const ShipmentMedicine = require("../../models/booking/shipmentMedicine");
const ResponseWrapper = require("../../utils/responseWrapper");
const { verifyToken } = require("../../middleware/authMiddleware");

// Create shipment medicine
exports.create = [
  verifyToken,
  async (req, res) => {
    try {
      const { address, medicine, delivery, coupon } = req.body;

      // Hitung subtotal dari array medicine
      const subtotal = medicine.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      // Buat pesanan baru
      const shipment = await ShipmentMedicine.create({
        address,
        medicine,
        delivery,
        coupon,
        subtotal,
        deliveryFee: 0, // sesuai kasus bebas ongkir
        totalPrice: subtotal, // subtotal + deliveryFee - discount
      });

      res.json(ResponseWrapper.success(shipment, "Pesanan berhasil dibuat"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal membuat pesanan", error.message));
    }
  },
];

exports.getAll = [
  verifyToken,
  async (req, res) => {
    try {
      const shipments = await ShipmentMedicine.find()
        .populate("delivery")
        .populate("coupon");

      res.json(ResponseWrapper.success(shipments));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data pesanan", error.message)
      );
    }
  },
];

exports.getById = [
  verifyToken,
  async (req, res) => {
    try {
      const shipment = await ShipmentMedicine.findById(req.params.id)
        .populate("delivery")
        .populate("coupon");

      if (!shipment) {
        return res.json(ResponseWrapper.error("Pesanan tidak ditemukan"));
      }

      res.json(ResponseWrapper.success(shipment));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data pesanan", error.message)
      );
    }
  },
];

exports.updateStatus = [
  verifyToken,
  async (req, res) => {
    try {
      const { status } = req.body;

      const shipment = await ShipmentMedicine.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!shipment) {
        return res.json(ResponseWrapper.error("Pesanan tidak ditemukan"));
      }

      res.json(
        ResponseWrapper.success(shipment, "Status pesanan berhasil diupdate")
      );
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengupdate status pesanan", error.message)
      );
    }
  },
];

exports.cancel = [
  verifyToken,
  async (req, res) => {
    try {
      const shipment = await ShipmentMedicine.findByIdAndUpdate(
        req.params.id,
        { status: "cancelled" },
        { new: true }
      );

      if (!shipment) {
        return res.json(ResponseWrapper.error("Pesanan tidak ditemukan"));
      }

      res.json(ResponseWrapper.success(null, "Pesanan berhasil dibatalkan"));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal membatalkan pesanan", error.message)
      );
    }
  },
];
