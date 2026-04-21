import { Router } from "express";
import {
  getSummary,
  getExpensesByCategory,
  getMonthlyExpenses,
  getMonthlyIncome,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// rutas protegidas con token

//resumen general
router.get("/summary", authMiddleware, getSummary);

// gastos por categoría gráfica de pastel
router.get(
  "/expenses-by-category",
  authMiddleware,
  getExpensesByCategory
);

// gastos por mes gráfica de barras
router.get(
  "/monthly-expenses",
  authMiddleware,
  getMonthlyExpenses
);

//ingresos por mes
router.get(
  "/monthly-income",
  authMiddleware,
  getMonthlyIncome
);

export default router;