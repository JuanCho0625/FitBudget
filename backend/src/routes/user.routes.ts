import { Router } from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// DEBUG (quitalo después)
console.log("user.routes cargado");

// Rutas protegidas (solo autenticación)
router.get("/", authMiddleware, getUsers);
router.get("/:id", authMiddleware, getUserById);

// Solo ADMIN puede actualizar
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateUser
);

// Solo ADMIN puede eliminar
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteUser
);

export default router;