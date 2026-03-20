const express = require('express');
const router = express.Router();

// Get /api/auth
router.get('/', (req,res)=>{
    res.json({message: 'Auth Route Funcionando...'})
});

// Post /api/uth/register
router.post('/register', (req, res)=>{
    res.json({message: 'Usuario registrado (mock)'})
});

// POST /api/auth/login
router.post('/login', (req, res)=>{
    res.json({message: 'Login Exitoso (mock)'})
})

module.exports = router;