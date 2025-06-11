const {
  getAdminById,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  createAdmin,
} = require("../controllers/admin.controller");
const authGuard = require("../middlewares/guards/auth.guard");
const isSuperAdminGuard = require("../middlewares/guards/isSuperAdmin.guard");

const router = require("express").Router();

router.get("/", getAllAdmins);
router.get("/:id", getAdminById);
router.patch("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);

router.post("/", authGuard, isSuperAdminGuard, createAdmin);

module.exports = router;
