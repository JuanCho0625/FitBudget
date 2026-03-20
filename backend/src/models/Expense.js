const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'El monto es obligatorio'],
      min: [0.01, 'El monto debe ser mayor a 0'],
    },
    category: {
      type: String,
      enum: ['comida', 'transporte', 'ocio', 'suscripciones', 'renta', 'escuela', 'otro'],
      default: 'otro',
    },
    description: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    budgetPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);