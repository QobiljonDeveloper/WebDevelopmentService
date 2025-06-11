const {
  getAllWebsiteTypes,
  getWebsiteTypeById,
  createWebsiteType,
  updateWebsiteType,
  deleteWebsiteType,
} = require("../controllers/websiteType.controller");
const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");

const router = require("express").Router();

router.get("/", authGuard, roleGuard(["admin"]), getAllWebsiteTypes);
router.post("/", authGuard, roleGuard(["admin"]), createWebsiteType);
router.patch("/:id", authGuard, roleGuard(["admin"]), updateWebsiteType);
router.delete(
  "/:id",
  authGuard,
  roleGuard(["admin"]),
  authGuard,
  roleGuard(["admin"]),
  deleteWebsiteType
);
router.get("/:id", authGuard, roleGuard(["admin"]), getWebsiteTypeById);

module.exports = router;
