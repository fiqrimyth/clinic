const Review = require("../models/review");
const Doctor = require("../models/menu/doctor");
const ResponseWrapper = require("../utils/responseWrapper");
const { verifyToken } = require("../middleware/authMiddleware");

exports.getAllReviews = [
  verifyToken,
  async (req, res) => {
    try {
      const doctorId = req.query.doctorId;

      if (doctorId) {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
          return res
            .status(404)
            .json(ResponseWrapper.error(404, "Dokter tidak ditemukan"));
        }
        const reviews = await Review.find({ doctorId: doctorId });
        return res.status(200).json(ResponseWrapper.success(reviews));
      } else {
        const reviews = await Review.find();
        return res.status(200).json(ResponseWrapper.success(reviews));
      }
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];

exports.getReviewsByDoctorId = [
  verifyToken,
  async (req, res) => {
    try {
      const reviews = await Review.find({ doctorId: req.params.doctorId });
      res.status(200).json(ResponseWrapper.success(reviews));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Internal Server Error", error.message)
        );
    }
  },
];

exports.createReview = [
  verifyToken,
  async (req, res) => {
    try {
      const reviews = Array.isArray(req.body) ? req.body : [req.body];
      const createdReviews = [];

      for (const reviewData of reviews) {
        const doctor = await Doctor.findById(reviewData.doctorId);
        if (!doctor) {
          return res
            .status(404)
            .json(
              ResponseWrapper.error(
                404,
                `Dokter dengan ID ${reviewData.doctorId} tidak ditemukan`
              )
            );
        }

        const review = new Review(reviewData);
        const newReview = await review.save();

        doctor.reviews = doctor.reviews || [];
        doctor.reviews.push(newReview._id);
        await doctor.save();

        createdReviews.push(newReview);
      }

      res
        .status(201)
        .json(
          ResponseWrapper.success(createdReviews, "Review berhasil dibuat")
        );
    } catch (error) {
      res
        .status(400)
        .json(
          ResponseWrapper.error(400, "Gagal membuat review", error.message)
        );
    }
  },
];

exports.updateReview = [
  verifyToken,
  async (req, res) => {
    try {
      const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!review) {
        return res
          .status(404)
          .json(ResponseWrapper.error(404, "Review tidak ditemukan"));
      }
      res
        .status(200)
        .json(ResponseWrapper.success(review, "Review berhasil diupdate"));
    } catch (error) {
      res
        .status(400)
        .json(
          ResponseWrapper.error(400, "Gagal mengupdate review", error.message)
        );
    }
  },
];

exports.deleteReview = [
  verifyToken,
  async (req, res) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) {
        return res
          .status(404)
          .json(ResponseWrapper.error(404, "Review tidak ditemukan"));
      }

      await Doctor.findByIdAndUpdate(review.doctorId, {
        $pull: { reviews: review._id },
      });

      await Review.findByIdAndDelete(req.params.id);

      res
        .status(200)
        .json(ResponseWrapper.success(null, "Review berhasil dihapus"));
    } catch (error) {
      res
        .status(500)
        .json(
          ResponseWrapper.error(500, "Gagal menghapus review", error.message)
        );
    }
  },
];
