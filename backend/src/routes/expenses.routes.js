const express = require('express');
const router = express.Router();

// GET /api/expenses
router.get('/', (req,res)=>{
    res.json({ message: 'Lista de gastos'})
})

// POST /api/expenses
router.post('/', (res,res)=>{
    res.json({ message: 'Gasto Creado'}
    )
})

module.exports = router;