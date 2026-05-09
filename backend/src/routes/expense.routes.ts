import { Router } from "express";
import {
  getExpenses,
  getExpenseById,
} from "../controllers/expense.controller";  
import { 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from "../controllers/transactions.controller";  
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @openapi
 * tags:
 *   name: Expenses
 *   description: Gestión de gastos y transacciones de salida
 */

/**
 * @openapi
 * /api/expenses:
 *   get:
 *     summary: Obtener todos los gastos del usuario
 *     tags: [Expenses]
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
 *     responses:
 *       200:
 *         description: Lista de gastos obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Expense'
 */
router.get("/", authMiddleware, getExpenses);

/**
 * @openapi
 * /api/expenses/{id}:
 *   get:
 *     summary: Obtener un gasto por ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID único del gasto
 *     responses:
 *       200:
 *         description: Detalle del gasto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Expense'
 *       404:
 *         description: Gasto no encontrado
 */
router.get("/:id", authMiddleware, getExpenseById);

/**
 * @openapi
 * /api/expenses:
 *   post:
 *     summary: Crear una nueva transacción de gasto
 *     tags: [Expenses]
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
 *                 example: 450.75
 *               description:
 *                 type: string
 *                 example: "Cena con amigos"
 *               categoryId:
 *                 type: string
 *                 example: "60d0fe4f5311236168a109ca"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-08T20:30:00Z"
 *     responses:
 *       201:
 *         description: Gasto registrado y notificación enviada por Sockets
 *       400:
 *         description: Datos inválidos
 */
router.post("/", authMiddleware, createTransaction);

/**
 * @openapi
 * /api/expenses/{id}:
 *   put:
 *     summary: Actualizar una transacción existente
 *     tags: [Expenses]
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
 *             $ref: '#/components/schemas/Expense'
 *     responses:
 *       200:
 *         description: Transacción actualizada correctamente
 *       404:
 *         description: Gasto no encontrado
 */
router.put("/:id", authMiddleware, updateTransaction);

/**
 * @openapi
 * /api/expenses/{id}:
 *   delete:
 *     summary: Eliminar una transacción
 *     tags: [Expenses]
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
 *         description: Gasto eliminado con éxito
 */
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;