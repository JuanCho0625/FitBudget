const mongoose = require('mongoose');

const savingGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'El nombre de la meta es obligatorio'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'El monto objetivo es obligatorio'],
      min: [0.01, 'El monto objetivo debe ser mayor a 0'],
    },
    currentAmount: { type: Number, default: 0, min: 0 },
    deadline: { type: Date },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

savingGoalSchema.virtual('progress').get(function () {
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100).toFixed(1);
});

module.exports = mongoose.model('SavingGoal', savingGoalSchema);