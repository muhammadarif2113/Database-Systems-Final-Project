const express = require('express'); //page where we configure all our routes 
const { 
    homeCtrlFunction, 
    carouselCtrlFunction,
    eventsCtrlFunction,
    loginCtrlFunction, 
    registerCtrlFunction, 
    storeCtrlFunction, 
    storeCartCtrlFunction,
    deleteCtrlFunction


} = require('../controllers/pagesCtrlFile');  
const router = express.Router(); 

router.get('/', homeCtrlFunction); 
router.get('/carousel', carouselCtrlFunction); 
router.get('/events', eventsCtrlFunction); 
router.get('/login', loginCtrlFunction); 
router.get('/register', registerCtrlFunction);
router.get('/delete', deleteCtrlFunction);  
router.get('/store', storeCtrlFunction); 
router.get('/storeCart', storeCartCtrlFunction); 


module.exports = router;
