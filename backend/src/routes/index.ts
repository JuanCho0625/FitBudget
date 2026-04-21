import { Router } from "express";
import authRouter from './auth.routes';
import userRouter from './user.routes';
import budgetRouter from './budget.routes';
import categoryRouter from './category.routes'
import expenseRouter from './expense.routes'
import incomeRouter from './income.routes'
import savingGoalRouter from './savingGoal.routes'
import dashboardRouter from "./dashboard.routes";

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/expenses', expenseRouter);
router.use('/incomes', incomeRouter);
router.use('/categories', categoryRouter);
router.use('/budgets', budgetRouter);
router.use('/saving-goals', savingGoalRouter);
router.use("/dashboard", dashboardRouter);

export default router;