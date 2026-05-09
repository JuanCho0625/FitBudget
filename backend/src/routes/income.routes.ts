import { Router } from "express";
import {
  getIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../controllers/income.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Incomes
 *   description: Gestión de ingresos de dinero
 */

/**
 * @openapi
 * /api/incomes:
 *   get:
 *     summary: Obtener todos los ingresos del usuario
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *         description: Filtrar por mes (1-12)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrar por año (ej. 2026)
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filtrar por ID de categoría específica
 *     responses:
 *       200:
 *         description: Lista de ingresos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Income'
 */
router.get("/", authMiddleware, getIncomes);

/**
 * @openapi
 * /api/incomes/{id}:
 *   get:
 *     summary: Obtener un ingreso por ID
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del ingreso
 *     responses:
 *       200:
 *         description: Detalle del ingreso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Income'
 *       404:
 *         description: Ingreso no encontrado
 */
router.get("/:id", authMiddleware, getIncomeById);

/**
 * @openapi
 * /api/incomes:
 *   post:
 *     summary: Registrar un nuevo ingreso
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, description, categoryId]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 2500.50
 *               description:
 *                 type: string
 *                 example: "Pago de Freelance"
 *               categoryId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109cc"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-08T12:00:00Z"
 *     responses:
 *       201:
 *         description: Ingreso registrado exitosamente
 *       400:
 *         description: Error en los datos enviados
 */
router.post("/", authMiddleware, createIncome);

/**
 * @openapi
 * /api/incomes/{id}:
 *   put:
 *     summary: Actualizar un ingreso existente
 *     tags: [Incomes]
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
 *             $ref: '#/components/schemas/Income'
 *     responses:
 *       200:
 *         description: Ingreso actualizado
 *       404:
 *         description: No encontrado
 */
router.put("/:id", authMiddleware, updateIncome);

/**
 * @openapi
 * /api/incomes/{id}:
 *   delete:
 *     summary: Eliminar un ingreso
 *     tags: [Incomes]
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
 *         description: Ingreso eliminado correctamente
 */
router.delete("/:id", authMiddleware, deleteIncome);

export default router;
