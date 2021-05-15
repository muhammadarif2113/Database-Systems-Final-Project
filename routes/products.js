const express = require('express'); //routes needed to pull all our products from
const { productsCtrlFunction } = require('../controllers/productsCtrlFile'); 
const router = express.Router(); 

router.get('/', productsCtrlFunction); 


module.exports = router;