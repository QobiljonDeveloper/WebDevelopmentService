const {
  getAllDevelopers,
  getDeveloperById,
  updateDeveloper,
  deleteDeveloper,
  getTopDevelopersPerService,
  changePassword,
} = require("../controllers/developer.controller");
const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");
const selfOrAdminGuard = require("../middlewares/guards/selfOrAdminGuard.guard");

const router = require("express").Router();

router.get("/", authGuard, roleGuard(["admin"]), getAllDevelopers);
router.get(
  "/:id",
  authGuard,
  roleGuard(["developer", "admin"]),
  selfOrAdminGuard("developer"),
  getDeveloperById
);
router.patch(
  "/:id",
  authGuard,
  roleGuard(["developer", "admin"]),
  selfOrAdminGuard("developer"),
  updateDeveloper
);
router.delete(
  "/:id",
  authGuard,
  roleGuard(["developer", "admin"]),
  selfOrAdminGuard("admin"),
  deleteDeveloper
);

router.patch(
  "/:id/change-password",
  authGuard,
  roleGuard(["developer", "admin"]),
  selfOrAdminGuard,
  changePassword
);

router.post("/most-active-developers", getTopDevelopersPerService);

module.exports = router;
