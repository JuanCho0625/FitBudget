require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authRoutes     = require('./routes/auth.routes');
const incomeRoutes   = require('./routes/incomes.routes');
const expenseRoutes  = require('./routes/expenses.routes');
const goalRoutes     = require('./routes/goals.routes');

const app = express();

app.use(express.json());

app.use('/auth',     authRoutes);
app.use('/incomes',  incomeRoutes);
app.use('/expenses', expenseRoutes);
app.use('/goals',    goalRoutes);

app.get('/', (req, res) => {
  res.json({
    app: 'Fitbudget API',
    version: '1.0.0',
    status: 'running',
    endpoints: ['/auth', '/incomes', '/expenses', '/goals'],
  });
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});