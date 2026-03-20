const express = require('exxpress');
const router = express.Router();

//GET /api/goals
router.get('/', (res, res)=>{
    res.json({message: 'Lista de metas'})
})

//POST /api/goals
router.post('/', (res,res)=>{
    res.json({message: 'Meta creada'})
})

module.exports = router;