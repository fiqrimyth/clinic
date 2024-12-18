const History = require("../../models/menu/history");
const ResponseWrapper = require("../../utils/responseWrapper");
const { verifyToken } = require("../../middleware/authMiddleware");

exports.getAllHistory = [
  verifyToken,
  async (req, res) => {
    try {
      const histories = await History.find().populate("userId", "name email");
      res.status(200).json(ResponseWrapper.success(histories));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];

exports.getHistoryById = [
  verifyToken,
  async (req, res) => {
    try {
      const history = await History.findById(req.params.id).populate(
        "userId",
        "name email"
      );
      if (!history) {
        return res
          .status(404)
          .json(ResponseWrapper.error(404, "History tidak ditemukan"));
      }
      res.status(200).json(ResponseWrapper.success(history));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];

exports.getHistoryByUserId = [
  verifyToken,
  async (req, res) => {
    try {
      const histories = await History.find({
        userId: req.params.userId,
      }).populate("userId", "name email");

      if (!histories.length) {
        return res
          .status(404)
          .json(
            ResponseWrapper.error(404, "History tidak ditemukan untuk user ini")
          );
      }

      res.status(200).json(ResponseWrapper.success(histories));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];
