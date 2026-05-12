import { Router } from "express";

import {
    getExpensesByCategory,
    getMonthlyExpenses,
} from "../controllers/chart.controller";

import {
    authMiddleware,
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/expenses-by-category",
    authMiddleware,
    getExpensesByCategory
);

router.get(
    "/monthly-expenses",
    authMiddleware,
    getMonthlyExpenses
);

export default router;