//so we are able to access the following pages
exports.homeCtrlFunction = (req, res) => {
    res.render('index')
} 
exports.carouselCtrlFunction = (req, res) => {
    res.render('carousel')
} 
exports.eventsCtrlFunction = (req, res) => {
    res.render('events')
} 
exports.loginCtrlFunction = (req, res) => {
    res.render('login')
} 
exports.registerCtrlFunction = (req, res) => {
    res.render('register')
}
exports.deleteCtrlFunction = (req, res) => {
    res.render('delete')
}  
exports.storeCtrlFunction = (req, res) => {
    res.render('store')
} 
exports.storeCartCtrlFunction = (req, res) => {
    res.render('storeCart')
} 
