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

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: Gestión de usuarios y perfiles (Requiere privilegios según el rol)
 */

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obtener lista de todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 */
router.get("/", authMiddleware, getUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obtener información de un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", authMiddleware, getUserById);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar datos de un usuario (Solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Diego Ortiz Actualizado"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 example: "ADMIN"
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       403:
 *         description: Prohibido - Se requieren permisos de ADMIN
 *       404:
 *         description: Usuario no encontrado
 */
router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  updateUser
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario del sistema (Solo ADMIN)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       403:
 *         description: Prohibido - Solo el administrador puede realizar esta acción
 *       404:
 *         description: Usuario no encontrado
 */
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("ADMIN"),
  deleteUser
);

export default router;