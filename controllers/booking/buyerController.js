const Buyer = require("../../models/booking/buyer");
const ResponseWrapper = require("../../utils/responseWrapper");
const { verifyToken } = require("../../middleware/authMiddleware");

// Get semua buyer
exports.getAllBuyers = [
  verifyToken,
  async (req, res) => {
    try {
      const buyers = await Buyer.find();
      res.json(ResponseWrapper.success(buyers));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data buyer", error.message)
      );
    }
  },
];

// Get buyer by ID
exports.getBuyerById = [
  verifyToken,
  async (req, res) => {
    try {
      const buyer = await Buyer.findById(req.params.id);
      if (!buyer) {
        return res.json(ResponseWrapper.error("Buyer tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(buyer));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data buyer", error.message)
      );
    }
  },
];

// Buat buyer baru
exports.createBuyer = [
  verifyToken,
  async (req, res) => {
    try {
      const buyer = await Buyer.create(req.body);
      res.json(ResponseWrapper.success(buyer, "Buyer berhasil dibuat"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal membuat buyer", error.message));
    }
  },
];

// Update buyer
exports.updateBuyer = [
  verifyToken,
  async (req, res) => {
    try {
      const buyer = await Buyer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!buyer) {
        return res.json(ResponseWrapper.error("Buyer tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(buyer, "Buyer berhasil diupdate"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal mengupdate buyer", error.message));
    }
  },
];

// Delete buyer
exports.deleteBuyer = [
  verifyToken,
  async (req, res) => {
    try {
      const buyer = await Buyer.findByIdAndDelete(req.params.id);
      if (!buyer) {
        return res.json(ResponseWrapper.error("Buyer tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(null, "Buyer berhasil dihapus"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal menghapus buyer", error.message));
    }
  },
];
