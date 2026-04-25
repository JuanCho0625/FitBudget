import { Response } from "express";
import { User } from "../models/User";
import { SavingGoal } from "../models/SavingGoal";
import { AuthRequest } from "../middlewares/auth.middleware";
import { sendEmail } from "../services/email.service";

export const getSavingGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: any = { userId: req.userId };
    if (status) filter.status = status;
    const goals = await SavingGoal.find(filter).sort({ createdAt: -1 });
    const result = goals.map(g => ({ ...g.toObject(), progressPercentage: Math.min((g.currentAmount / g.targetAmount) * 100, 100).toFixed(1) }));
    res.json(result);
  } catch (error) { res.status(500).json({ message: "Error al obtener metas de ahorro" }); }
};

export const getSavingGoalById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await SavingGoal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) { res.status(404).json({ message: "Meta de ahorro no encontrada" }); return; }
    res.json({ ...goal.toObject(), progressPercentage: Math.min((goal.currentAmount / goal.targetAmount) * 100, 100).toFixed(1) });
  } catch (error) { res.status(500).json({ message: "Error al obtener meta de ahorro" }); }
};

export const createSavingGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { goalName, targetAmount, deadline, currentAmount } = req.body;
    if (!goalName || !targetAmount || !deadline) {
      res.status(400).json({ message: "Nombre, monto objetivo y fecha límite son obligatorios" }); return;
    }
    if (targetAmount <= 0) { res.status(400).json({ message: "El monto objetivo debe ser mayor a 0" }); return; }
    if (new Date(deadline) <= new Date()) { res.status(400).json({ message: "La fecha límite debe ser futura" }); return; }
    const goal = new SavingGoal({ userId: req.userId, goalName, targetAmount, currentAmount: currentAmount || 0, deadline, status: "active" });
    await goal.save();
    res.status(201).json({ message: "Meta de ahorro creada correctamente", goal });
  } catch (error) { res.status(500).json({ message: "Error al crear meta de ahorro" }); }
};

export const updateSavingGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { goalName, targetAmount, currentAmount, deadline, status, addAmount } = req.body;
    const goal = await SavingGoal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) { res.status(404).json({ message: "Meta de ahorro no encontrada" }); return; }

    const wasCompleted = goal.status === "completed";

    if (goalName) goal.goalName = goalName;
    if (targetAmount !== undefined) {
      if (targetAmount <= 0) { res.status(400).json({ message: "El monto objetivo debe ser mayor a 0" }); return; }
      goal.targetAmount = targetAmount;
    }
    if (deadline) goal.deadline = deadline;
    if (status)   goal.status   = status;

    if (addAmount !== undefined) {
      if (addAmount <= 0) { res.status(400).json({ message: "El monto a abonar debe ser mayor a 0" }); return; }
      goal.currentAmount = Math.min(goal.currentAmount + addAmount, goal.targetAmount);
    } else if (currentAmount !== undefined) {
      goal.currentAmount = currentAmount;
    }

    const justCompleted = !wasCompleted && goal.currentAmount >= goal.targetAmount;
    if (justCompleted) goal.status = "completed";

    await goal.save();

    // ── Correo: meta completada 
    if (justCompleted) {
      const user = await User.findById(req.userId);
      if (user) await sendEmail(user.email, "goalCompleted", { userName: user.name, goalName: goal.goalName, targetAmount: goal.targetAmount });
    }

    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    res.json({
      message: "Meta de ahorro actualizada",
      goal: { ...goal.toObject(), progressPercentage: Math.min(progress, 100).toFixed(1) },
      ...(justCompleted && { alert: "🎉 ¡Felicidades! Has alcanzado tu meta de ahorro" }),
    });
  } catch (error) { res.status(500).json({ message: "Error al actualizar meta de ahorro" }); }
};

export const deleteSavingGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await SavingGoal.findOne({ _id: req.params.id, userId: req.userId });
    if (!goal) { res.status(404).json({ message: "Meta de ahorro no encontrada" }); return; }
    await goal.deleteOne();
    res.json({ message: "Meta de ahorro eliminada" });
  } catch (error) { res.status(500).json({ message: "Error al eliminar meta de ahorro" }); }
};
