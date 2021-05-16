//routes needed for registering users and loggin in 
const express = require('express'); 
const authController = require('../controllers/auth'); 
const router = express.Router(); 

router.post('/login', authController.login); 
router.post('/register', authController.register); 
router.post('/delete', authController.delete); 

module.exports = router; 
