/**
 * @openapi
 * components:
 *   schemas:
 *     Budget:
 *       type: object
 *       required:
 *         - userId
 *         - monthlyLimit
 *         - month
 *         - year
 *       properties:
 *         _id:
 *           type: string
 *           example: 6412abc1234567890
 *         userId:
 *           type: string
 *           description: ID del usuario dueño del presupuesto
 *           example: 6412abc1234567890
 *         monthlyLimit:
 *           type: number
 *           minimum: 0
 *           description: Límite de gasto mensual permitido
 *           example: 5000
 *         month:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *           description: Mes del presupuesto (1-12)
 *           example: 5
 *         year:
 *           type: integer
 *           description: Año del presupuesto
 *           example: 2026
 *         isAlerted:
 *           type: boolean
 *           description: Indica si el usuario ya superó el presupuesto y fue notificado
 *           default: false
 */

import mongoose, {Schema, model, Document} from 'mongoose';

export interface IBudget extends Document{
    userId: mongoose.Types.ObjectId;
    monthlyLimit: number;
    month: number;
    year: number;
    isAlerted: boolean;
}


const budgetSchema = new Schema<IBudget>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    monthlyLimit: { 
      type: Number, 
      required: true,
      min: 0 
    },
    month: { 
      type: Number, 
      required: true,
      min: 1,
      max: 12
    },
    year: { 
      type: Number, 
      required: true,
      default: () => new Date().getFullYear()
    },
    isAlerted: { 
      type: Boolean, 
      default: false 
    }
  },
  { 
    timestamps: true 
  }
);

budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export const Budget = model<IBudget>("Budget", budgetSchema);