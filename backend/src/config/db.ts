import mongoose from "mongoose";
import { Category } from "../models/Category";

const DEFAULT_CATEGORIES = [
    // ── Gastos ──────────────────────────────────────
    { name: "Comida",          type: "expense", color: "#f97316" },
    { name: "Transporte",      type: "expense", color: "#eab308" },
    { name: "Universidad",     type: "expense", color: "#6366f1" },
    { name: "Entretenimiento", type: "expense", color: "#ec4899" },
    { name: "Compras",         type: "expense", color: "#f43f5e" },
    { name: "Salud",           type: "expense", color: "#14b8a6" },
    { name: "Servicios",       type: "expense", color: "#0ea5e9" },
    { name: "Ahorro",          type: "expense", color: "#22c55e" },
    { name: "Otros",           type: "expense", color: "#94a3b8" },
    // ── Ingresos ────────────────────────────────────
    { name: "Salario",         type: "income",  color: "#22c55e" },
    { name: "Beca",            type: "income",  color: "#a3e635" },
    { name: "Apoyo Familiar",  type: "income",  color: "#34d399" },
    { name: "Freelance",       type: "income",  color: "#3b82f6" },
    { name: "Préstamo",        type: "income",  color: "#f59e0b" },
    { name: "Ventas",          type: "income",  color: "#8b5cf6" },
    { name: "Otros",           type: "income",  color: "#94a3b8" },
];

const seedCategories = async () => {
    // Drop the old single-field index if it still exists so the compound one can work
    try {
        await Category.collection.dropIndex("name_1");
        console.log("🗑️  Índice antiguo name_1 eliminado");
    } catch (_) {
        // Index didn't exist — that's fine
    }

    for (const cat of DEFAULT_CATEGORIES) {
        await Category.updateOne(
            { name: cat.name, type: cat.type },
            { $setOnInsert: cat },
            { upsert: true }
        );
    }
    console.log("✅ Categorías base verificadas");
};

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL!);
        console.log("Conectado a MongoDB");
        await seedCategories();
    } catch (error) {
        console.error("No se pudo conectar a MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
