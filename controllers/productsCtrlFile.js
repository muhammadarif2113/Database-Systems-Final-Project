//pull all our products from product.js
const { productList } = require('../products')

exports.productsCtrlFunction = (req, res) => {
    try{
        
        res.status(200).json({
            products: productList

        })

    } catch (error){
        console.log(error); 

    }
}
