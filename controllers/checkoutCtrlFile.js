//all checkout functionality is in this file 
//also stores checkout and cart information of users in our tables 
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
<<<<<<< HEAD
                          //all items added to cart are added to database 
=======
                          //all items added to cart are added to database * by quantity to get right price
>>>>>>> 5a7ba7303e94b176f3f848e3934edbcab65c1820
                            let q = `INSERT INTO Cart_Items(product_name, product_quantity, product_amount) 
                            VALUES("${singleProductList.name}", ${singleProductFrontend.inCart}, ${singleProductList.price * singleProductFrontend.inCart})`;
                            db.query(q);                      
                      }
                  })

              })
              return products 
          }
<<<<<<< HEAD
          // console.log(productsToBuy()); 
=======
           //console.log(productsToBuy()); 
>>>>>>> 5a7ba7303e94b176f3f848e3934edbcab65c1820

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
 
            //if there are successful orders, user information is added to Order_History table 
             let q = `INSERT INTO Order_History(email, name, total_amount) 
             VALUES("${email}", "${name}", ${total})`;
             db.query(q); 

            //if there are successful orders, user address information is added to Address table 
             let addressQuery = `INSERT INTO Address(name, city, state, country, street, zip) 
             VALUES("${name}", "${city}", "${state}", "${country}", "${line1}", "${zip}")`;
             db.query(addressQuery); 

            //for every successful order, the payment information of a user gets stored in the Payment_Info table
             let paymentQuery = `INSERT INTO Payment_Info(email, name, payment_status, payment_method, payment_intent) 
             VALUES("${email}", "${name}", "${session.payment_status}", "${session.payment_method_types}", "${session.payment_intent}")`;
             db.query(paymentQuery); 

             //user's session gets stored into User_Session table 
             let sessionQuery = `INSERT INTO User_Session(email, name, id, customer) 
             VALUES("${email}", "${name}", "${session.id}", "${session.customer}")`;
             db.query(sessionQuery); 


            //send email 
            await new Email({
                name: session.shipping.name, 
                email: session.customer_details.email
            },  total).sendThankYou(); 

            const temp = true;  
            //if Email results true, or sends, insert email sent to and true or false value in table
            if (Email){
                let emailQuery = `INSERT INTO Email_Sent(email, email_sent) 
                VALUES("${email}", ${temp})`;
                db.query(emailQuery); 
            } else {
                let emailQuery = `INSERT INTO Email_Sent(email, email_sent) 
                VALUES("${email}", ${!temp})`;
                db.query(emailQuery); 
            }
            
            return res.status(200).json({
                success: true
            })
    

        }

        res.status(200).json({
            success: false
        })

    }
