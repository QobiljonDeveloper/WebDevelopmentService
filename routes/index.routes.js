const router = require("express").Router();

const authRouter = require("./auth.routes");
const developerRouter = require("./developer.routes");
const clientRouter = require("./client.routes");
const adminRouter = require("./admin.routes");
const statusRouter = require("./status.routes");
const websiteTypeRouter = require("./websiteType.routes");
const websiteRouter = require("./website.routes");
const contract_developerRoutes = require("./contract-developer.routes");
const paymentRouter = require("./payment.routes");
const contractRouter = require("./contract.routes");
const notificationRouter = require("./notification.routes");
const feedbackRouter = require("./feedback.routes");
const userProfileRouter = require("./userProfile.routes");
const superRouter = require("./super.admin.routes");

router.use("/auth", authRouter);
router.use("/developer", developerRouter);
router.use("/client", clientRouter);
router.use("/admin", adminRouter);
router.use("/status", statusRouter);
router.use("/website-type", websiteTypeRouter);
router.use("/website", websiteRouter);
router.use("/contract-developer", contract_developerRoutes);
router.use("/payment", paymentRouter);
router.use("/contract", contractRouter);
router.use("/notification", notificationRouter);
router.use("/feedback", feedbackRouter);
router.use("/user-profile", userProfileRouter);
router.use("/super", superRouter);

module.exports = router;
