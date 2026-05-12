
/**
 * @openapi
 * components:
 *   schemas:
 *     SavingGoal:
 *       type: object
 *       required:
 *         - goalName
 *         - targetAmount
 *         - deadline
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d0fe4f5311236168a109cd
 *         goalName:
 *           type: string
 *           description: Nombre de la meta de ahorro
 *           example: "Viaje de graduación"
 *         targetAmount:
 *           type: number
 *           minimum: 1
 *           example: 15000
 *         currentAmount:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 2500
 *         deadline:
 *           type: string
 *           format: date-time
 *           description: Fecha límite para alcanzar la meta
 *         status:
 *           type: string
 *           enum: [active, completed, paused]
 *           default: active
 */


import mongoose, {Schema, model, Document} from "mongoose";

export interface ISavingGoal extends Document {
  userId: mongoose.Types.ObjectId;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  status: 'active' | 'completed' | 'paused';   
}

const savingGoalSchema = new Schema<ISavingGoal>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    goalName: { 
      type: String, 
      required: [true, "El nombre de la meta es obligatorio"],
      trim: true 
    },
    targetAmount: { 
      type: Number, 
      required: true,
      min: 1 
    },
    currentAmount: { 
      type: Number, 
      default: 0,
      min: 0 
    },
    deadline: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      default: 'active',
      enum: ['active', 'completed', 'paused'] 
    }
  },
  { 
    timestamps: true 
  }
);

export const SavingGoal = model<ISavingGoal>("SavingGoal", savingGoalSchema);