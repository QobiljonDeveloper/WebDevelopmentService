const express = require("express");
const router = express.Router();
const { createSuperAdmin } = require("../controllers/super.admin.controller");

router.post("/", createSuperAdmin);

module.exports = router;
