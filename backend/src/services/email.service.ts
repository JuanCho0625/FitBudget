import nodemailer from "nodemailer";
import {
  welcomeTemplate,
  budgetAlertTemplate,
  goalCompletedTemplate,
} from "../templates/email.templates";

export type EmailType = "welcome" | "budgetAlert" | "goalCompleted";

interface WelcomeData { userName: string; }
interface BudgetAlertData {
  userName: string; monthlyLimit: number; totalSpent: number;
  percentageUsed: number; month: number; year: number;
}
interface GoalCompletedData { userName: string; goalName: string; targetAmount: number; }
export type EmailData = WelcomeData | BudgetAlertData | GoalCompletedData;

const createTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
  });

export const sendEmail = async (
  to: string,
  type: EmailType,
  data: EmailData
): Promise<void> => {
  try {
    const transporter = createTransporter();
    let subject = "";
    let html = "";

    switch (type) {
      case "welcome":
        subject = "¡Bienvenido a FitBudget! 🎉";
        html = welcomeTemplate(data as WelcomeData);
        break;
      case "budgetAlert":
        subject = "⚠️ Alerta de presupuesto — FitBudget";
        html = budgetAlertTemplate(data as BudgetAlertData);
        break;
      case "goalCompleted":
        subject = "🎯 ¡Meta de ahorro alcanzada! — FitBudget";
        html = goalCompletedTemplate(data as GoalCompletedData);
        break;
    }

    await transporter.sendMail({
      from: `"FitBudget" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Correo [${type}] enviado a ${to}`);
  } catch (error) {
    console.error(`❌ Error enviando correo [${type}] a ${to}:`, error);
  }
};
