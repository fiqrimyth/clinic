const Doctor = require("../../models/menu/doctor");
const ResponseWrapper = require("../../utils/responseWrapper");
const { verifyToken } = require("../../middleware/authMiddleware");

exports.getAllDoctors = [
  verifyToken,
  async (req, res) => {
    try {
      const doctors = await Doctor.find().populate("reviews");
      res.json(ResponseWrapper.success(doctors));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data dokter", error.message)
      );
    }
  },
];

exports.getDoctorById = [
  verifyToken,
  async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.json(ResponseWrapper.error("Dokter tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(doctor));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data dokter", error.message)
      );
    }
  },
];

exports.createDoctor = [
  verifyToken,
  async (req, res) => {
    try {
      let newDoctors;
      if (Array.isArray(req.body)) {
        newDoctors = await Doctor.insertMany(req.body);
      } else {
        const doctor = new Doctor(req.body);
        newDoctors = await doctor.save();
      }
      res.json(ResponseWrapper.success(newDoctors, "Dokter berhasil dibuat"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal membuat dokter", error.message));
    }
  },
];

exports.updateDoctor = [
  verifyToken,
  async (req, res) => {
    try {
      const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!doctor) {
        return res.json(ResponseWrapper.error("Dokter tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(doctor, "Dokter berhasil diupdate"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal mengupdate dokter", error.message));
    }
  },
];

exports.deleteDoctor = [
  verifyToken,
  async (req, res) => {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);
      if (!doctor) {
        return res.json(ResponseWrapper.error("Dokter tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(null, "Dokter berhasil dihapus"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal menghapus dokter", error.message));
    }
  },
];

exports.clearCollection = [
  verifyToken,
  async (req, res) => {
    try {
      await Doctor.collection.drop();
      res.json(
        ResponseWrapper.success(null, "Collection doctors berhasil dihapus")
      );
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal menghapus collection", error.message)
      );
    }
  },
];
