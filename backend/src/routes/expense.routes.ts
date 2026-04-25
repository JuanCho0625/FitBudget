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
 
router.get("/", authMiddleware, getExpenses);
router.get("/:id", authMiddleware, getExpenseById);
router.post("/", authMiddleware, createTransaction);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;