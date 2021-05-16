//Connecting stripe (payment processing app) to our store's checkout


//const host = 'http://localhost:3001' //used when developing
const host = 'http://nbastorebutbetter.club' //used when in production 


const stripe = Stripe('pk_test_51IpTKjICt0mRPXVSdjOawpBjFgwUYBZSgaYDFNhF20AVyEMsrcORkCSnVe3eI25LNcwNoFLbUbiBxmArI8IVEDr500eyV5EVLw');

const startCheckout = document.getElementById('startCheckout'); 

startCheckout.addEventListener('click', () => {
    console.log("buy button clicked"); 
    startCheckout.textContent = "Processing..."
    buyProducts(myProducts())
}); 

function myProducts(){
    const getProducts = JSON.parse(localStorage.getItem('productsInCart')); 

    const products = [];

    console.log(getProducts);  
    for( const property in getProducts){
        products.push({
            tag: getProducts[property].tag, 
            inCart: getProducts[property].inCart
        })
    }
    return products; 
}

async function buyProducts(cartProducts){
    try{
        const body = JSON.stringify({
            products: cartProducts
        })
        const response = await axios.post(`${host}/checkout`, body, {
            headers: {
                Accept: "application/json", 
                "Content-Type": "application/json"
            }
        })

        console.log(response.data); 
        
        localStorage.setItem('sessionId', response.data.session.id);

         await stripe.redirectToCheckout({
           sessionId: response.data.session.id
         })
    
    } catch (error){
        console.log(error); 
    }
}
