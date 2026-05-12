import { Router } from "express";
import {
  getBudgets,
  getBudgetByMonth,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Budgets
 *   description: Gestión de presupuestos mensuales
 */

/**
 * @openapi
 * /api/budgets:
 *   get:
 *     summary: Obtener todos los presupuestos del usuario
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de presupuestos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Budget'
 *       401:
 *         description: No autorizado
 */
router.get("/", authMiddleware, getBudgets);

/**
 * @openapi
 * /api/budgets/{month}/{year}:
 *   get:
 *     summary: Obtener presupuesto de un mes y año específico
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: month
 *         required: true
 *         schema:
 *           type: integer
 *         description: Mes (1-12)
 *       - in: path
 *         name: year
 *         required: true
 *         schema:
 *           type: integer
 *         description: Año (ej. 2026)
 *     responses:
 *       200:
 *         description: Datos del presupuesto encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Budget'
 *       404:
 *         description: Presupuesto no encontrado
 */
router.get("/:month/:year", authMiddleware, getBudgetByMonth);

/**
 * @openapi
 * /api/budgets:
 *   post:
 *     summary: Crear un nuevo presupuesto mensual
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [monthlyLimit, month, year]
 *             properties:
 *               monthlyLimit:
 *                 type: number
 *                 example: 5000
 *               month:
 *                 type: integer
 *                 example: 5
 *               year:
 *                 type: integer
 *                 example: 2026
 *     responses:
 *       201:
 *         description: Presupuesto creado exitosamente
 *       400:
 *         description: Datos inválidos o presupuesto ya existente para ese periodo
 */
router.post("/", authMiddleware, createBudget);

/**
 * @openapi
 * /api/budgets/{id}:
 *   put:
 *     summary: Actualizar un presupuesto existente
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del presupuesto (ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monthlyLimit:
 *                 type: number
 *                 example: 6000
 *               isAlerted:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Presupuesto actualizado correctamente
 *       404:
 *         description: No se encontró el presupuesto
 */
router.put("/:id", authMiddleware, updateBudget);

/**
 * @openapi
 * /api/budgets/{id}:
 *   delete:
 *     summary: Eliminar un presupuesto
 *     tags: [Budgets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del presupuesto
 *     responses:
 *       200:
 *         description: Presupuesto eliminado
 *       404:
 *         description: No se encontró el presupuesto
 */
router.delete("/:id", authMiddleware, deleteBudget);

export default router;
