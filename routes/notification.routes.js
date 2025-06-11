const router = require("express").Router();
const authGuard = require("../middlewares/guards/auth.guard");
const selfOrAdminGuard = require("../middlewares/guards/selfOrAdminGuard.guard");

const {
  createNotification,
  getMyNotifications,
  markAsRead,
} = require("../controllers/notification.controller");

router.post("/", authGuard, createNotification);

router.get("/", authGuard, getMyNotifications);

router.patch("/:id/read", authGuard, selfOrAdminGuard("notification"), markAsRead);

module.exports = router;
