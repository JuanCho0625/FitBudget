import { Router } from "express";

import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";

import {
  authMiddleware,
} from "../middlewares/auth.middleware";

import {
  roleMiddleware,
} from "../middlewares/role.middleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Gestión de usuarios y perfiles
 */

router.get(
    "/",
    authMiddleware,
    getUsers
);

router.get(
    "/:id",
    authMiddleware,
    getUserById
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware([
      "ADMIN",
    ]),
    updateUser
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware([
      "ADMIN",
    ]),
    deleteUser
);

export default router;