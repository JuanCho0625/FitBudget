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

router.get("/", authMiddleware, getBudgets);
router.get("/:month/:year", authMiddleware, getBudgetByMonth);
router.post("/", authMiddleware, createBudget);
router.put("/:id", authMiddleware, updateBudget);
router.delete("/:id", authMiddleware, deleteBudget);

export default router;
