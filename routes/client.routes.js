const {
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/client.controller");
const authGuard = require("../middlewares/guards/auth.guard");
const selfOrAdminGuard = require("../middlewares/guards/selfOrAdminGuard.guard");
const roleGuard = require("../middlewares/guards/role.guard");
const router = require("express").Router();

router.get("/", authGuard, roleGuard(["admin"]), getAllClients);
router.get(
  "/:id",
  authGuard,
  roleGuard(["client", "admin"]),
  selfOrAdminGuard("client"),
  getClientById
);
router.patch(
  "/:id",
  authGuard,
  roleGuard(["client", "admin"]),
  selfOrAdminGuard("client"),
  updateClient
);
router.delete(
  "/:id",
  authGuard,
  roleGuard(["client", "admin"]),
  selfOrAdminGuard("client"),
  deleteClient
);

module.exports = router;

module.exports = router;
