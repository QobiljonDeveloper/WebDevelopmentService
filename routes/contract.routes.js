const {
  getAllContracts,
  createContract,
  updateContract,
  deleteContract,
  getContractById,
  getMyContracts,
  getContractsByWebsites,
  getClientsByDateRange,
  getCancelledClientsByDateRange,
} = require("../controllers/contract.controller");
const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");

const router = require("express").Router();

router.get("/", authGuard, roleGuard(["client", "admin"]), getAllContracts);
router.get(
  "/getmyContracts",
  authGuard,
  roleGuard(["client", "admin"]),
  getMyContracts
);
router.post(
  "/by-date",
  authGuard,
  roleGuard(["client", "admin"]),
  getContractsByWebsites
);
router.post(
  "/clients-by-date",
  authGuard,
  roleGuard(["client", "admin"]),
  getClientsByDateRange
);

router.post(
  "/clients-cancelled",
  authGuard,
  roleGuard(["client", "admin"]),
  getCancelledClientsByDateRange
);

router.post("/", authGuard, roleGuard(["client", "admin"]), createContract);
router.patch("/:id", authGuard, roleGuard(["client", "admin"]), updateContract);
router.delete("/:id", authGuard, roleGuard(["admin"]), deleteContract);
router.get("/:id", authGuard, roleGuard(["client", "admin"]), getContractById);

module.exports = router;
