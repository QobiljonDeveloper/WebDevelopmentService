const {
  updateStatus,
  createStatus,
  getStatusById,
  getAllStatuses,
  deleteStatus,
} = require("../controllers/status.controller");

const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");

const router = require("express").Router();

router.get("/", authGuard, getAllStatuses);
router.get("/:id", authGuard, getStatusById);

router.post("/", authGuard, roleGuard(["admin"]), createStatus);
router.patch("/:id", authGuard, roleGuard(["admin"]), updateStatus);
router.delete("/:id", authGuard, roleGuard(["admin"]), deleteStatus);

module.exports = router;
