const Update = require("../models/menu/update");
const ResponseWrapper = require("../utils/responseWrapper");
const { verifyToken } = require("../middleware/authMiddleware");

// Get all updates
exports.getAllUpdates = [
  verifyToken,
  async (req, res) => {
    try {
      const updates = await Update.find().sort({ date: -1 });
      return res
        .status(200)
        .json(ResponseWrapper.success("Data berhasil diambil", updates));
    } catch (error) {
      return res
        .status(500)
        .json(ResponseWrapper.error("Internal server error", error));
    }
  },
];

// Get single update
exports.getUpdateById = [
  verifyToken,
  async (req, res) => {
    try {
      const update = await Update.findById(req.params.id);
      if (!update) {
        return res
          .status(404)
          .json(ResponseWrapper.error("Update tidak ditemukan"));
      }
      return res
        .status(200)
        .json(ResponseWrapper.success("Data berhasil diambil", update));
    } catch (error) {
      return res
        .status(500)
        .json(ResponseWrapper.error("Internal server error", error));
    }
  },
];

// Create new update
exports.createUpdate = [
  verifyToken,
  async (req, res) => {
    try {
      const update = await Update.create(req.body);
      return res
        .status(201)
        .json(ResponseWrapper.success("Update berhasil dibuat", update));
    } catch (error) {
      return res
        .status(500)
        .json(ResponseWrapper.error("Internal server error", error));
    }
  },
];

// Update existing update
exports.updateUpdate = [
  verifyToken,
  async (req, res) => {
    try {
      const update = await Update.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!update) {
        return res
          .status(404)
          .json(ResponseWrapper.error("Update tidak ditemukan"));
      }
      return res
        .status(200)
        .json(ResponseWrapper.success("Update berhasil diperbarui", update));
    } catch (error) {
      return res
        .status(500)
        .json(ResponseWrapper.error("Internal server error", error));
    }
  },
];

// Delete update
exports.deleteUpdate = [
  verifyToken,
  async (req, res) => {
    try {
      const update = await Update.findByIdAndDelete(req.params.id);
      if (!update) {
        return res
          .status(404)
          .json(ResponseWrapper.error("Update tidak ditemukan"));
      }
      return res
        .status(200)
        .json(ResponseWrapper.success("Update berhasil dihapus"));
    } catch (error) {
      return res
        .status(500)
        .json(ResponseWrapper.error("Internal server error", error));
    }
  },
];
