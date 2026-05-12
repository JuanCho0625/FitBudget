import { Router } from "express";
import {
  getSavingGoals,
  getSavingGoalById,
  createSavingGoal,
  updateSavingGoal,
  deleteSavingGoal,
} from "../controllers/savingGoal.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: SavingGoals
 *   description: Seguimiento de metas de ahorro y objetivos financieros
 */

/**
 * @openapi
 * /api/saving-goals:
 *   get:
 *     summary: Listar todas las metas de ahorro del usuario
 *     tags: [SavingGoals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de metas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavingGoal'
 */
router.get("/", authMiddleware, getSavingGoals);

/**
 * @openapi
 * /api/saving-goals/{id}:
 *   get:
 *     summary: Obtener detalle de una meta específica
 *     tags: [SavingGoals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único de la meta de ahorro
 *     responses:
 *       200:
 *         description: Detalle de la meta encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavingGoal'
 *       404:
 *         description: Meta no encontrada
 */
router.get("/:id", authMiddleware, getSavingGoalById);

/**
 * @openapi
 * /api/saving-goals:
 *   post:
 *     summary: Crear una nueva meta de ahorro
 *     tags: [SavingGoals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [goalName, targetAmount, deadline]
 *             properties:
 *               goalName:
 *                 type: string
 *                 example: "Fondo para Laptop nueva"
 *               targetAmount:
 *                 type: number
 *                 example: 25000
 *               currentAmount:
 *                 type: number
 *                 default: 0
 *                 example: 1000
 *               deadline:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: Meta de ahorro creada con éxito
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post("/", authMiddleware, createSavingGoal);

/**
 * @openapi
 * /api/saving-goals/{id}:
 *   put:
 *     summary: Actualizar progreso o información de una meta
 *     tags: [SavingGoals]
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
 *               goalName:
 *                 type: string
 *               targetAmount:
 *                 type: number
 *               currentAmount:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, completed, paused]
 *               deadline:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Meta actualizada correctamente
 *       404:
 *         description: Meta no encontrada
 */
router.put("/:id", authMiddleware, updateSavingGoal);

/**
 * @openapi
 * /api/saving-goals/{id}:
 *   delete:
 *     summary: Eliminar una meta de ahorro
 *     tags: [SavingGoals]
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
 *         description: Meta eliminada exitosamente
 *       404:
 *         description: Meta no encontrada
 */
router.delete("/:id", authMiddleware, deleteSavingGoal);

export default router;
