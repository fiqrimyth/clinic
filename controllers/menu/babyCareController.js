const BabyCare = require("../../models/menu/babyCare");
const ResponseWrapper = require("../../utils/responseWrapper");
const { verifyToken } = require("../../middleware/authMiddleware");

exports.getAllBabyCare = [
  verifyToken,
  async (req, res) => {
    try {
      const babyCares = await BabyCare.find();
      res.status(200).json(ResponseWrapper.success(babyCares));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];

exports.getBabyCareById = [
  verifyToken,
  async (req, res) => {
    try {
      const babyCare = await BabyCare.findById(req.params.id);
      if (!babyCare) {
        return res
          .status(404)
          .json(ResponseWrapper.error(404, "Baby Care tidak ditemukan"));
      }
      res.status(200).json(ResponseWrapper.success(babyCare));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];

exports.createBabyCare = [
  verifyToken,
  async (req, res) => {
    try {
      let newBabyCares;

      if (Array.isArray(req.body)) {
        newBabyCares = await BabyCare.insertMany(req.body);
      } else {
        const babyCare = new BabyCare(req.body);
        newBabyCares = await babyCare.save();
      }

      res
        .status(201)
        .json(
          ResponseWrapper.success(newBabyCares, "Baby Care berhasil dibuat")
        );
    } catch (error) {
      res
        .status(400)
        .json(
          ResponseWrapper.error(400, "Gagal membuat Baby Care", error.message)
        );
    }
  },
];

exports.updateBabyCare = [
  verifyToken,
  async (req, res) => {
    try {
      const babyCare = await BabyCare.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );
      if (!babyCare) {
        return res
          .status(404)
          .json(ResponseWrapper.error(404, "Baby Care tidak ditemukan"));
      }
      res
        .status(200)
        .json(ResponseWrapper.success(babyCare, "Baby Care berhasil diupdate"));
    } catch (error) {
      res
        .status(400)
        .json(
          ResponseWrapper.error(
            400,
            "Gagal mengupdate Baby Care",
            error.message
          )
        );
    }
  },
];

exports.deleteBabyCare = [
  verifyToken,
  async (req, res) => {
    try {
      const babyCare = await BabyCare.findByIdAndDelete(req.params.id);
      if (!babyCare) {
        return res
          .status(404)
          .json(ResponseWrapper.error(404, "Baby Care tidak ditemukan"));
      }
      res
        .status(200)
        .json(ResponseWrapper.success(null, "Baby Care berhasil dihapus"));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(
            500,
            "Internal Server Error",
            "Gagal menghapus Baby Care"
          )
        );
    }
  },
];

exports.clearCollection = [
  verifyToken,
  async (req, res) => {
    try {
      await BabyCare.collection.drop();
      res.json({ message: "Collection babycare berhasil dihapus" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];
