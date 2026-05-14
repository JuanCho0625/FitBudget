/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           example: 6412abc987654321
 *         name:
 *           type: string
 *           description: Nombre único de la categoría
 *           example: "Comida"
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo de flujo financiero
 *           example: expense
 *         color:
 *           type: string
 *           description: Código hexadecimal del color para la UI
 *           example: "#FF5733"
 *//**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         _id:
 *           type: string
 *           example: 6412abc987654321
 *         name:
 *           type: string
 *           description: Nombre único de la categoría
 *           example: "Comida"
 *         type:
 *           type: string
 *           enum: [income, expense]
 *           description: Tipo de flujo financiero
 *           example: expense
 *         color:
 *           type: string
 *           description: Código hexadecimal del color para la UI
 *           example: "#FF5733"
 */

import mongoose, { Document, model, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    type: "income" | "expense";
    color: string;
}

const categorySchema = new Schema<ICategory>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["income", "expense"],
        },
        color: {
            type: String,
            default: "#000000",
        },
    },
    { timestamps: true },
);

// Unique per name+type so "Otros" can exist for both income and expense
categorySchema.index({ name: 1, type: 1 }, { unique: true });

export const Category = model<ICategory>('Category', categorySchema);
