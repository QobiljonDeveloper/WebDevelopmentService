const {
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
  createFeedback,
} = require("../controllers/feedback.controller");
const authMiddleware = require("../middlewares/guards/auth.guard");
const selfOrAdminGuard = require("../middlewares/guards/selfOrAdminGuard.guard");

const router = require("express").Router();

router.get("/", authMiddleware, getAllFeedbacks);
router.post("/", authMiddleware, createFeedback);
router.patch("/:id", authMiddleware, selfOrAdminGuard("feedback"), updateFeedback);
router.delete("/:id", authMiddleware, selfOrAdminGuard("feedback"), deleteFeedback);
router.get("/:id", authMiddleware, selfOrAdminGuard("feedback"), getFeedbackById);

module.exports = router;
