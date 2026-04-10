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
            unique: true,
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

export const Category = model<ICategory>('Category', categorySchema);
