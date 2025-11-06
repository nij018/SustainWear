const express = require("express");
const router = express.Router();
const cors = require("cors");
const adminController = require("../controllers/adminController");

// middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.get("/users", adminController.getAllUsers);
router.put("/users", adminController.updateUser);
router.get("/organisations", adminController.getAllOrganisations);
router.post("/organisations", adminController.addOrganisation);
router.put("/organisations/status", adminController.updateOrganisationStatus);
router.delete("/organisations/:id", adminController.deleteOrganisation);
router.get("/logs", adminController.getAuditLogs);

module.exports = router;