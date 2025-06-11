const {
  getAllContractDevelopers,
  deleteContractDeveloper,
  getContractDeveloperById,
  createContractDeveloper,
} = require("../controllers/contractDeveloper.controller");
const authGuard = require("../middlewares/guards/auth.guard");
const roleGuard = require("../middlewares/guards/role.guard");

const router = require("express").Router();

router.get("/", authGuard, roleGuard(["admin"]), getAllContractDevelopers);
router.post("/", authGuard, roleGuard(["admin"]), createContractDeveloper);
router.post(
  "/remove",
  authGuard,
  roleGuard(["admin"]),
  deleteContractDeveloper
);
router.get("/:id", authGuard, roleGuard(["admin"]), getContractDeveloperById);

module.exports = router;
