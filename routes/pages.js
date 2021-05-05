const express = require('express'); 

const router = express.Router(); 

router.get("/", (req, res) => {
    res.render("index"); 
});

router.get("/register", (req, res) => {
    res.render("register"); 
});
router.get("/login", (req, res) => {
    res.render("login"); 
});
router.get("/carousel", (req, res) => {
    res.render("carousel"); 
});
router.get("/credit", (req, res) => {
    res.render("credit"); 
});
router.get("/events", (req, res) => {
    res.render("events"); 
});
router.get("/cart", (req, res) => {
    res.render("cart"); 
});
router.get("/store", (req, res) => {
    res.render("store"); 
});
router.get("/storeCart", (req, res) => {
    res.render("storeCart"); 
});
module.exports = router;