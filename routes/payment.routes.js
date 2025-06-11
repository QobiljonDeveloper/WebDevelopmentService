const {
  updatePayment,
  createPayment,
  getPaymentById,
  getAllPayments,
  deletePayment,
  getClientPaymentsWithServiceAndOwner,
} = require("../controllers/payment.controller");

const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");

const router = require("express").Router();

router.get("/", authGuard, roleGuard(["client", "admin"]), getAllPayments);
router.post("/by-client", getClientPaymentsWithServiceAndOwner);
router.post("/", authGuard, roleGuard(["client", "admin"]), createPayment);
router.patch("/:id", authGuard, roleGuard(["admin"]), updatePayment);
router.delete("/:id", authGuard, roleGuard(["admin"]), deletePayment);
router.get("/:id", authGuard, roleGuard(["client", "admin"]), getPaymentById);

module.exports = router;
