const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { productList } = require('../products'); 
const Email = require('../utils/email'); 

exports.checkoutCtrlFunction = async (req, res) => {
    try {
        //console.log(req.body.products);
        
        const productsFromFrontend = req.body.products; 
       //   console.log(productList); 

          function productsToBuy(){
              let products = []; 

              productList.forEach(singleProductList => {
                  productsFromFrontend.forEach(singleProductFrontend => {
                      if(singleProductList.tag === singleProductFrontend.tag){
                          products.push({
                              name: singleProductList.name, 
                              description: singleProductList.description, 
                              images: [singleProductList.image], 
                              amount: singleProductList.price * 100, 
                              currency: 'usd', 
                              quantity: singleProductFrontend.inCart
                          })
                      }
                  })
              })
              return products 
          }
           console.log(productsToBuy()); 

           const session = await stripe.checkout.sessions.create({
              payment_method_types: ['card'], 
              success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
              cancel_url: `${req.protocol}://${req.get('host')}/storeCart`,
              shipping_address_collection: { 
                  allowed_countries: ['US']
              }, 
              line_items: productsToBuy()
           }); 

        res.status(200).json({
            status: "success", 
            session:session
            
        })
    } catch(error){
        console.log(error); 
        }
    }

    exports.cartSuccessFunction = (req, res) => {
        res.render("thankyouPage"); 
    }
    exports.finishOrder = async (req, res) => {
        const session = await stripe.checkout.sessions.retrieve(
            req.params.id
        )

        console.log("my payment was: "); 
        console.log(session); 
    
        if(session.payment_status === 'paid'){
            // const purchasedProducts = session.display_items.map(product => (
            //     {
            //         productName: product.custom.name,
            //         price: product.amount / 100, 
            //         quantity: product.quantity
            //     }
            // ))
            //save to database 
            //send email 
            const total = session.amount_total / 100; 
            await new Email({
                name: session.shipping.name, 
                email: session.customer_details.email
            },  total).sendThankYou(); 

            return res.status(200).json({
                success: true
            })
        }

        res.status(200).json({
            success: false
        })
    }