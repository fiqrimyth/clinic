const Patient = require("../../models/booking/patient");
const ResponseWrapper = require("../../utils/responseWrapper");
const { verifyToken } = require("../../middleware/authMiddleware");

// Get semua patient
exports.getAllPatients = [
  verifyToken,
  async (req, res) => {
    try {
      const patients = await Patient.find();
      res.json(ResponseWrapper.success(patients));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data patient", error.message)
      );
    }
  },
];

// Get patient by ID
exports.getPatientById = [
  verifyToken,
  async (req, res) => {
    try {
      const patient = await Patient.findById(req.params.id);
      if (!patient) {
        return res.json(ResponseWrapper.error("Patient tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(patient));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengambil data patient", error.message)
      );
    }
  },
];

// Buat patient baru
exports.createPatient = [
  verifyToken,
  async (req, res) => {
    try {
      const patient = await Patient.create(req.body);
      res.json(ResponseWrapper.success(patient, "Patient berhasil dibuat"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal membuat patient", error.message));
    }
  },
];

// Update patient
exports.updatePatient = [
  verifyToken,
  async (req, res) => {
    try {
      const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!patient) {
        return res.json(ResponseWrapper.error("Patient tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(patient, "Patient berhasil diupdate"));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal mengupdate patient", error.message)
      );
    }
  },
];

// Delete patient
exports.deletePatient = [
  verifyToken,
  async (req, res) => {
    try {
      const patient = await Patient.findByIdAndDelete(req.params.id);
      if (!patient) {
        return res.json(ResponseWrapper.error("Patient tidak ditemukan"));
      }
      res.json(ResponseWrapper.success(null, "Patient berhasil dihapus"));
    } catch (error) {
      res.json(ResponseWrapper.error("Gagal menghapus patient", error.message));
    }
  },
];

// Clear collection
exports.clearCollection = [
  verifyToken,
  async (req, res) => {
    try {
      await Patient.deleteMany({});
      res.json(ResponseWrapper.success(null, "Semua patient berhasil dihapus"));
    } catch (error) {
      res.json(
        ResponseWrapper.error("Gagal menghapus collection", error.message)
      );
    }
  },
];
