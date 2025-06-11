const express = require("express");
const {
  getAllUserProfiles,
  getUserProfileById,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/userProfile.controller");

const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");
const selfOrAdminGuard = require("../middlewares/guards/selfOrAdminGuard.guard");

const router = express.Router();

router.get("/", authGuard, roleGuard(["admin"]), getAllUserProfiles);

router.get(
  "/:id",
  authGuard,
  selfOrAdminGuard("userProfile"),
  getUserProfileById
);

router.post("/", authGuard, createUserProfile);

router.patch(
  "/:id",
  authGuard,
  selfOrAdminGuard("userProfile"),
  updateUserProfile
);

router.delete(
  "/:id",
  authGuard,
  selfOrAdminGuard("userProfile"),
  deleteUserProfile
);

module.exports = router;
