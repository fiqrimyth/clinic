const Bookmark = require("../models/bookmark");
const ResponseWrapper = require("../utils/responseWrapper");
const { verifyToken } = require("../middleware/authMiddleware");

// Get bookmark status
exports.getBookmarkStatus = [
  verifyToken,
  async (req, res) => {
    try {
      const bookmark = await Bookmark.findOne();
      if (!bookmark) {
        const newBookmark = await Bookmark.create({ isBookmarked: false });
        return res.status(200).json(ResponseWrapper.success(newBookmark));
      }
      res.status(200).json(ResponseWrapper.success(bookmark));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];

exports.toggleBookmark = [
  verifyToken,
  async (req, res) => {
    try {
      let bookmark = await Bookmark.findOne();

      if (!bookmark) {
        bookmark = await Bookmark.create({ isBookmarked: true });
      } else {
        bookmark.isBookmarked = !bookmark.isBookmarked;
        await bookmark.save();
      }

      res.status(200).json(ResponseWrapper.success(bookmark));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];
