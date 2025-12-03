const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Minimal API per specification
//router.get('/delivered', projectController.getDelivered);
router.get("/delivered", projectController.getDelivered);
router.get("/delivered/:id", projectController.getDeliveredById);

module.exports = router;
