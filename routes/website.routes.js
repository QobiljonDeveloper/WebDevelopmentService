const {
  getAllWebsites,
  createWebsite,
  updateWebsite,
  deleteWebsite,
  getWebsiteById,
} = require("../controllers/website.controller");
const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");

const router = require("express").Router();

router.get("/", authGuard, roleGuard(["admin"]), getAllWebsites);
router.post("/", authGuard, roleGuard(["admin", "developer"]), createWebsite);
router.patch(
  "/:id",
  authGuard,
  roleGuard(["admin", "developer"]),
  updateWebsite
);
router.delete("/:id", authGuard, roleGuard(["admin"]), deleteWebsite);
router.get("/:id", authGuard, getWebsiteById);

module.exports = router;
