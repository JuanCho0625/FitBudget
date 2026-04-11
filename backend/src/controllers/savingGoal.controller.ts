import { Response } from "express";
import { savingGoal as SavingGoal } from "../models/SavingGoal";
import { AuthRequest } from "../middlewares/auth.middleware";

// ======================
// GET ALL SAVING GOALS (del usuario)
// ======================
export const getSavingGoals = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { status } = req.query;

    const filter: any = { userId: req.userId };
    if (status) filter.status = status;

    const goals = await SavingGoal.find(filter).sort({ createdAt: -1 });

    // Añadir porcentaje de progreso a cada meta
    const goalsWithProgress = goals.map((goal) => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      return {
        ...goal.toObject(),
        progressPercentage: Math.min(progress, 100).toFixed(1),
      };
    });

    res.json(goalsWithProgress);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener metas de ahorro" });
  }
};

// ======================
// GET SAVING GOAL BY ID
// ======================
export const getSavingGoalById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!goal) {
      res.status(404).json({ message: "Meta de ahorro no encontrada" });
      return;
    }

    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    res.json({
      ...goal.toObject(),
      progressPercentage: Math.min(progress, 100).toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener meta de ahorro" });
  }
};

// ======================
// CREATE SAVING GOAL
// ======================
export const createSavingGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { goalName, targetAmount, deadline, currentAmount } = req.body;

    if (!goalName || !targetAmount || !deadline) {
      res.status(400).json({
        message: "Nombre, monto objetivo y fecha límite son obligatorios",
      });
      return;
    }

    if (targetAmount <= 0) {
      res.status(400).json({ message: "El monto objetivo debe ser mayor a 0" });
      return;
    }

    if (new Date(deadline) <= new Date()) {
      res.status(400).json({ message: "La fecha límite debe ser futura" });
      return;
    }

    const goal = new SavingGoal({
      userId: req.userId,
      goalName,
      targetAmount,
      currentAmount: currentAmount || 0,
      deadline,
      status: "active",
    });

    await goal.save();

    res.status(201).json({ message: "Meta de ahorro creada correctamente", goal });
  } catch (error) {
    res.status(500).json({ message: "Error al crear meta de ahorro" });
  }
};

// ======================
// UPDATE SAVING GOAL (incluyendo abonar)
// ======================
export const updateSavingGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { goalName, targetAmount, currentAmount, deadline, status, addAmount } =
      req.body;

    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!goal) {
      res.status(404).json({ message: "Meta de ahorro no encontrada" });
      return;
    }

    if (goalName) goal.goalName = goalName;
    if (targetAmount !== undefined) {
      if (targetAmount <= 0) {
        res.status(400).json({ message: "El monto objetivo debe ser mayor a 0" });
        return;
      }
      goal.targetAmount = targetAmount;
    }
    if (deadline) goal.deadline = deadline;
    if (status) goal.status = status;

    // Abonar a la meta (sumar al monto actual)
    if (addAmount !== undefined) {
      if (addAmount <= 0) {
        res.status(400).json({ message: "El monto a abonar debe ser mayor a 0" });
        return;
      }
      goal.currentAmount = Math.min(
        goal.currentAmount + addAmount,
        goal.targetAmount
      );
    } else if (currentAmount !== undefined) {
      goal.currentAmount = currentAmount;
    }

    // Auto-completar si se alcanza el objetivo
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    await goal.save();

    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    res.json({
      message: "Meta de ahorro actualizada",
      goal: {
        ...goal.toObject(),
        progressPercentage: Math.min(progress, 100).toFixed(1),
      },
      ...(goal.status === "completed" && {
        alert: "🎉 ¡Felicidades! Has alcanzado tu meta de ahorro",
      }),
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar meta de ahorro" });
  }
};

// ======================
// DELETE SAVING GOAL
// ======================
export const deleteSavingGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const goal = await SavingGoal.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!goal) {
      res.status(404).json({ message: "Meta de ahorro no encontrada" });
      return;
    }

    await goal.deleteOne();
    res.json({ message: "Meta de ahorro eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar meta de ahorro" });
  }
};