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

router.get("/", authMiddleware, getSavingGoals);
router.get("/:id", authMiddleware, getSavingGoalById);
router.post("/", authMiddleware, createSavingGoal);
router.put("/:id", authMiddleware, updateSavingGoal);
router.delete("/:id", authMiddleware, deleteSavingGoal);

export default router;
