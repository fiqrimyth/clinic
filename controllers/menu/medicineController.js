const ShipmentMedicine = require("../../models/booking/shipmentMedicine");
const ResponseWrapper = require("../../utils/responseWrapper");
const { verifyToken } = require("../../middleware/authMiddleware");

// Membuat pesanan baru
exports.create = [
  verifyToken,
  async (req, res) => {
    try {
      const { address, medicine, delivery, coupon } = req.body;
      const subtotal = medicine.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);

      const shipment = await ShipmentMedicine.create({
        address,
        medicine,
        delivery,
        coupon,
        subtotal,
        deliveryFee: 0,
        totalPrice: subtotal,
      });

      return ResponseWrapper.success(
        res,
        "Pesanan berhasil dibuat",
        shipment,
        201
      );
    } catch (error) {
      return ResponseWrapper.error(res, "Gagal membuat pesanan", error.message);
    }
  },
];

// Mendapatkan semua pesanan
exports.getAll = [
  verifyToken,
  async (req, res) => {
    try {
      const shipments = await ShipmentMedicine.find()
        .populate("delivery")
        .populate("coupon");

      return ResponseWrapper.success(
        res,
        "Data pesanan berhasil diambil",
        shipments
      );
    } catch (error) {
      return ResponseWrapper.error(
        res,
        "Gagal mengambil data pesanan",
        error.message
      );
    }
  },
];

// Mendapatkan detail pesanan
exports.getById = [
  verifyToken,
  async (req, res) => {
    try {
      const shipment = await ShipmentMedicine.findById(req.params.id)
        .populate("delivery")
        .populate("coupon");

      if (!shipment) {
        return ResponseWrapper.notFound(res, "Pesanan tidak ditemukan");
      }

      return ResponseWrapper.success(
        res,
        "Detail pesanan berhasil diambil",
        shipment
      );
    } catch (error) {
      return ResponseWrapper.error(
        res,
        "Gagal mengambil detail pesanan",
        error.message
      );
    }
  },
];

// Update status pesanan
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
        return ResponseWrapper.notFound(res, "Pesanan tidak ditemukan");
      }

      return ResponseWrapper.success(
        res,
        "Status pesanan berhasil diupdate",
        shipment
      );
    } catch (error) {
      return ResponseWrapper.error(
        res,
        "Gagal mengupdate status pesanan",
        error.message
      );
    }
  },
];

// Batalkan pesanan
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
        return ResponseWrapper.notFound(res, "Pesanan tidak ditemukan");
      }

      return ResponseWrapper.success(
        res,
        "Pesanan berhasil dibatalkan",
        shipment
      );
    } catch (error) {
      return ResponseWrapper.error(
        res,
        "Gagal membatalkan pesanan",
        error.message
      );
    }
  },
];
