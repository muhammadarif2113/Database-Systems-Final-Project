const express = require('express'); //page where we configure all our routes 
const { productsCtrlFunction } = require('../controllers/productsCtrlFile'); // 
const router = express.Router(); 

router.get('/', productsCtrlFunction); //


module.exports = router;