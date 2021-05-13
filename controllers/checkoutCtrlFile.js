const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 
const { productList } = require('../products'); 
const Email = require('../utils/email'); 
const mysql = require("mysql"); 
const express = require('express'); 
const router = express.Router(); 


const db = mysql.createConnection({
    host    : process.env.DATABASE_HOST, 
    user    : process.env.DATABASE_USER, 
    password: process.env.DATABASE_PASSWORD,   
    database: process.env.DATABASE
});

exports.checkoutCtrlFunction = async (req, res) => {
    try {        
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
                          console.log("--------------under------------------------"); 
                //  let q = `INSERT INTO Cart_Items(product_name, product_quantity, product_amount) 
                // VALUES("${singleProductFrontend.name}", ${singleProductFrontend.inCart}, ${singleProductFrontend.price})`;
                // db.query(q);
                
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
            //insert purchase data into Purchase_History table
            const total = session.amount_total / 100; 
             const email = session.customer_details.email
             const name = session.shipping.name 
             const city = session.shipping.address.city
             const state = session.shipping.address.state
             const country = session.shipping.address.country
             const line1 = session.shipping.address.line1
             const zip = session.shipping.address.postal_code
 

             let q = `INSERT INTO Order_History(email, name, total_amount, city, state, country, street, zip) 
             VALUES("${email}", "${name}", ${total}, "${city}", "${state}", "${country}", "${line1}", "${zip}")`;
             db.query(q); 


            //send email 
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