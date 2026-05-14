import {Income} from "../models/Income";
import {Expense} from "../models/Expense";
import {SavingGoal} from "../models/SavingGoal";

export const getUserFinancialSummary = async (userId: string) => {
 
  const [incomes, expenses, goals] = await Promise.all([
    Income.find({ userId: userId }),
    Expense.find({ userId: userId }),
    SavingGoal.find({ userId: userId })
  ]);

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
   
  const totalSaved = goals.reduce((acc, curr) => acc + (curr.currentAmount || 0), 0);

  return {
    balance: totalIncome - totalExpense - totalSaved,
    totalIncome,
    totalExpense,
    totalSaved,
    timestamp: new Date()
  };
};