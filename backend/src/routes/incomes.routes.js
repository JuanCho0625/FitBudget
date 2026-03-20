const express = require('express');
const router = express.Router();

// GET /api/incomes
router.get('/', (req, res)=>{
    res.json({message: 'Lista de ingresos'})
})

// POST /api/incomes
router.post('/', (req, res)=>{
    res.json({message: 'Ingreso Creado'})
})

module.exports = router;