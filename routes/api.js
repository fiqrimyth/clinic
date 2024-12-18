const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/menu/doctorController");
const babyCareController = require("../controllers/menu/babyCareController");
const reviewController = require("../controllers/reviewController");
const shipmentMedicineController = require("../controllers/booking/shipmentMedicineController");
const buyerController = require("../controllers/booking/buyerController");
const patientController = require("../controllers/booking/patientController");
const historyController = require("../controllers/menu/historyController");
const bookmarkController = require("../controllers/bookmarkController");
const updateController = require("../controllers/updateController");
const authController = require("../controllers/auth/authController");
const userController = require("../controllers/auth/userController");
const auth = require("../middleware/auth");
const apiKeyAuth = require("../middleware/apiKeyAuth");

// Route untuk autentikasi
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/social-login", authController.socialLogin);
router.post("/logout", auth, authController.logout);
router.patch("/change-password", auth, authController.changePassword);
router.post("/request-reset-password", authController.requestResetPassword);
router.post("/reset-password", authController.resetPassword);

// route yang memerlukan autentikasi
router.get("/profile", auth, (req, res) => {
  res.json({ message: "Route terproteksi" });
});

// User routes (API Key authentication)
router.get("/users", apiKeyAuth, userController.getAllUsers);
router.get("/users/:id", apiKeyAuth, userController.getUserById);
router.post("/users", apiKeyAuth, userController.createUser);
router.put("/users/:id", apiKeyAuth, userController.updateUser);
router.delete("/users/:id", apiKeyAuth, userController.deleteUser);
router.delete("/users/clear", apiKeyAuth, userController.clearCollection);

// Doctor routes
router.get("/doctors", doctorController.getAllDoctors);
router.get("/doctors/:id", doctorController.getDoctorById);
router.post("/doctors", doctorController.createDoctor);
router.put("/doctors/:id", doctorController.updateDoctor);
router.delete("/doctors/:id", doctorController.deleteDoctor);
router.delete("/doctors", doctorController.clearCollection);

// BabyCare routes
router.get("/babycare", babyCareController.getAllBabyCare);
router.get("/babycare/:id", babyCareController.getBabyCareById);
router.post("/babycare", babyCareController.createBabyCare);
router.put("/babycare/:id", babyCareController.updateBabyCare);
router.delete("/babycare/:id", babyCareController.deleteBabyCare);
router.delete("/babycare", babyCareController.clearCollection);

// Review routes
router.get("/reviews", reviewController.getAllReviews);
router.post("/reviews", reviewController.createReview);
router.put("/reviews/:id", reviewController.updateReview);
router.delete("/reviews/:id", reviewController.deleteReview);

// Routes untuk ShipmentMedicine
router.post("/shipments", shipmentMedicineController.create);
router.get("/shipments", shipmentMedicineController.getAll);
router.get("/shipments/:id", shipmentMedicineController.getById);
router.put("/shipments/:id/status", shipmentMedicineController.updateStatus);
router.put("/shipments/:id/cancel", shipmentMedicineController.cancel);

// Buyer Routes
router.get("/buyers", buyerController.getAllBuyers);
router.post("/buyers", buyerController.createBuyer);
router.get("/buyers/:id", buyerController.getBuyerById);
router.patch("/buyers/:id", buyerController.updateBuyer);
router.delete("/buyers/:id", buyerController.deleteBuyer);

// Patient Routes
router.get("/patients", patientController.getAllPatients);
router.post("/patients", patientController.createPatient);
router.get("/patients/:id", patientController.getPatientById);
router.patch("/patients/:id", patientController.updatePatient);
router.delete("/patients/:id", patientController.deletePatient);

// History routes
router.get("/history", historyController.getAllHistory);
router.get("/history/:id", historyController.getHistoryById);
router.get("/history/user/:userId", historyController.getHistoryByUserId);

// Bookmark routes
router.get("/bookmark", bookmarkController.getBookmarkStatus);
router.patch("/bookmark/toggle", bookmarkController.toggleBookmark);

// Update routes
router.get("/updates", updateController.getAllUpdates);
router.get("/updates/:id", updateController.getUpdateById);
router.post("/updates", updateController.createUpdate);
router.patch("/updates/:id", updateController.updateUpdate);
router.delete("/updates/:id", updateController.deleteUpdate);

module.exports = router;
