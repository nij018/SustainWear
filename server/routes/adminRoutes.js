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
router.get("/organisations", adminController.getOrganisations);
router.post("/organisations", adminController.createOrganisation);
router.put("/organisations/:id", adminController.updateOrganisation);
router.delete("/organisations/:id", adminController.deleteOrganisation);

module.exports = router;