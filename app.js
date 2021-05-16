//this will be the main server file for our project 
//this includes the sql codes to create the database and its tables

const express = require('express'); 
const mysql = require('mysql'); 
const path = require('path');
const http = require('http');
const fs = require('fs');
const cookieParser = require('cookie-parser'); 
const dotenv = require('dotenv');  
dotenv.config({path: './.env'}); 


const db = mysql.createConnection({
      host    : process.env.DATABASE_HOST, 
      user    : process.env.DATABASE_USER, 
      password: process.env.DATABASE_PASSWORD,   
      database: process.env.DATABASE
    
});

const app = express(); 
const publicDirectory = path.join(__dirname, './public'); 
app.use(express.static(publicDirectory)); 
app.use(express.urlencoded({extended: false })); 
app.use(express.json()); 
app.use(cookieParser()); 
app.set('view engine', 'hbs'); 

db.connect((err) => {
    if(err){
        throw err; 
    }
    console.log('Mysql connected'); 
});

//define routes
app.use('/', require('./routes/pages')); 
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products')); 
app.use('/checkout', require('./routes/checkout')); 

//<<<<<<< HEAD
//delete table code
app.get('/deleteaddress', (req, res) => {
    let sql = "DROP TABLE Address";
    db.query(sql, (err, result) => {
      if (err) throw err;
      console.log("Table deleted");
      res.send('table deleted')
    });
  });

//=======
//>>>>>>> 5a7ba7303e94b176f3f848e3934edbcab65c1820

//Create db 
app.get('/createdbNBAStore', (req, res) => {
    let sql = 'CREATE DATABASE NBAStore'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('databse created...'); 
    });
}); 

//Create table 
app.get('/createorderhistory', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Order_History(email VARCHAR(40) CHARACTER SET utf8, name VARCHAR(40) CHARACTER SET utf8, total_amount INT)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Order_History table created....'); 
    }); 
}); 
app.get('/createinventory', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Inventory(item_name VARCHAR(100) CHARACTER SET utf8, description VARCHAR(1000) CHARACTER SET utf8, price INT, count INT)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Inventory table created....'); 
    }); 
}); 
app.get('/createaddress', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Address(name VARCHAR(40) CHARACTER SET utf8, city VARCHAR(70) CHARACTER SET utf8, state VARCHAR(70) CHARACTER SET utf8, country VARCHAR(70) CHARACTER SET utf8, street VARCHAR(70) CHARACTER SET utf8, zip VARCHAR(70) CHARACTER SET utf8)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Address table created....'); 
    }); 
}); 
app.get('/createemailsent', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Email_Sent(email VARCHAR(40) CHARACTER SET utf8, email_sent BOOLEAN)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Email_Sent table created....'); 
    }); 
}); 
app.get('/createpaymentinfo', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Payment_Info(email VARCHAR(40) CHARACTER SET utf8, name VARCHAR(40) CHARACTER SET utf8, payment_status VARCHAR(100) CHARACTER SET utf8, payment_method VARCHAR(100) CHARACTER SET utf8, payment_intent VARCHAR(100) CHARACTER SET utf8)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('createpaymentinfo table created....'); 
    }); 
});
app.get('/createusersession', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS User_Session(email VARCHAR(100) CHARACTER SET utf8, name VARCHAR(100) CHARACTER SET utf8, id VARCHAR(200) CHARACTER SET utf8, customer VARCHAR(100) CHARACTER SET utf8)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('createpaymentinfo table created....'); 
    }); 
});
app.get('/createuseraccount', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS User_Account(username VARCHAR(80) CHARACTER SET utf8, password VARCHAR(80) CHARACTER SET utf8, phone_number VARCHAR(80) CHARACTER SET utf8)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('User_Account table created....'); 
    }); 
});
app.get('/createcartitems', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Cart_Items(product_name VARCHAR(300) CHARACTER SET utf8, product_quantity INT, product_amount INT)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Cart Items table created....'); 
    }); 
}); 
//Insert table
app.get('/insertinventory', (req, res) => { 
    let values = [
        ['Dallas Mavericks Jersey', 'Represent Dallas with this official NBAStore jersey', 80, 200], 
        ['Miami Heat Jersey', 'Represent Miami with this official NBAStore jersey', 80, 200],
        ['Washington Wizards Jersey', 'Represent Washington with this official NBAStore jersey', 80, 200],
        ['LA Lakers Jersey', 'Represent LA with this official NBAStore jersey', 80, 200],

        ['Nets Shirt', 'Represent Brooklyn with this official NBAStore shirt', 35, 200],
        ['Bucks Shirt', 'Represent Bucks with this official NBAStore shirt', 35, 200],
        ['Suns Shirt', 'Represent Suns with this official NBAStore shirt', 35, 200],
        ['Lakers Shirt', 'Represent LA with this official NBAStore shirt', 35, 200],

        ['Raptors Shorts', 'Rock our very own Raptors Shorts!', 40, 200],
        ['Rockets Shirt', 'Rock our very own Rockets Shorts!', 40, 200],
        ['Sixers Shirt', 'Rock our very own Sixers Shorts!', 40, 200],
        ['Bulls Shirt', 'Rock our very own Bulls Shorts!', 40, 200],

        ['Spalding Basketball', 'Train with the finest equipment, get the Spalding Basketball!', 60, 200],
        ['Wilson Basketball', 'Train with the finest equipment, get the Wilson Basketball!', 40, 200],
        ['Nike Basketball', 'Train with the finest equipment, get the Nike Basketball!', 30, 200],
        ['Jordan Basketball', 'Train with the finest equipment, get the Jordan Basketball!', 30, 200],
        
        ['Knicks Hat', 'Represent your team with the draft day Knicks Hat!', 25, 200],
        ['Clippers Hat', 'Represent your team with the draft day Clippers Hat!', 25, 200],
        ['Celtics Hat', 'Represent your team with the draft day Celtics Hat!', 25, 200],
        ['Lakers Hat', 'Represent your team with the draft day Lakers Hat!', 25, 200]
    ];
    let sql = 'INSERT INTO Inventory (item_name, description, price, count) VALUES ?'; 
    let query = db.query(sql, [values], (err, result) => {
    if(err) throw err; 
        console.log(result); 
        res.send('inserted...'); 
    });
}); 
/*
//Select posts 
app.get('/getpost/:id', (req, res) => { 
    let sql = `SELECT * FROM posts WHERE id = ${req.params.id}`; 
    let query = db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Posts fetched...'); 
    });
});

//Update posts 
app.get('/updatepost/:id', (req, res) => { 
    let newTitle = 'Updated Title'; 
    let sql = `UPDATE posts SET title = '${newTitle}' WHERE id = ${req.params.id}`; 
    let query = db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Post updated...');  
    }) 
});

//Delete posts 
app.get('/deletepost/:order_id', (req, res) => { 
    let newTitle = 'Updated Title'; 
    let sql = `DELETE FROM posts WHERE id = '${req.params.id}`; 
    let query = db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Post deleted...');  
    }); 
});
*/

app.listen('80', () => { 
    console.log('Server started 80');  
}); 
