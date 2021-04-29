const express = require('express'); 
const mysql = require('mysql'); 
const session = require('express-session'); 
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const fs = require('fs');
const connect = require('connect'); 
const { response } = require('express');




const db = mysql.createConnection({
    host    : 'localhost', 
    user    : 'moe', 
    password: 'password',  
    database: 'NBAStore'
    
}); 

db.connect((err) => {
    if(err){
        throw err; 
    }
    console.log('Mysql connected'); 
});



const app = express(); 

//login user and save to db 
/*app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
*/
//app.get('/', function(request, response) {
//	response.sendFile(path.join(__dirname + '/HTML/index.html'));
//    response.sendFile(path.join(__dirname, 'HTML', 'index.html'));

//});
//set home screen to index.html 
app.use(express.static(path.join(__dirname, 'HTML'))); 



/*app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM User_Account WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});
*/
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
    let sql = 'CREATE TABLE IF NOT EXISTS Order_History(order_id VARCHAR(4) CHARACTER SET utf8, amount INT, state VARCHAR(7) CHARACTER SET utf8, timestamp DATETIME)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Order_History table created....'); 
    }); 
}); 
app.get('/createorderitem', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Order_Item(order_item VARCHAR(19) CHARACTER SET utf8, quantity INT)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Order_Item table created....'); 
    }); 
}); 
app.get('/createorders', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Orders(order_id VARCHAR(4) CHARACTER SET utf8, order_date DATETIME, total_amount INT, state VARCHAR(7) CHARACTER SET utf8)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Orders table created....'); 
    }); 
}); 
app.get('/createuseraccount', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS User_Account(account_id VARCHAR(30) CHARACTER SET utf8, username VARCHAR(30) CHARACTER SET utf8, password VARCHAR(30) CHARACTER SET utf8, phone_number VARCHAR(70) CHARACTER SET utf8)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('User_Account table created....'); 
    }); 
}); 
app.get('/createaddress', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Address(name VARCHAR(30) CHARACTER SET utf8, street_address VARCHAR(30) CHARACTER SET utf8, city VARCHAR(30) CHARACTER SET utf8, state VARCHAR(30) CHARACTER SET utf8, zip INT)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Address table created....'); 
    }); 
}); 
app.get('/createcreditcard', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Credit_card(credit_card_id INT, credit_card_num INT, holder_name VARCHAR(30) CHARACTER SET utf8, expire_date DATETIME)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Credit card table created....'); 
    }); 
}); 
app.get('/createinvoice', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Invoice(invoice_id INT, creation_date DATETIME)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Invoice table created....'); 
    }); 
}); 
app.get('/createinvoicehistory', (req, res) => {
    let sql = 'CREATE TABLE IF NOT EXISTS Invoice_History(invoice_state_id INT, timestamp_date DATETIME, state VARCHAR(30) CHARACTER SET utf8)'; 
    db.query(sql, (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('Invoice History table created....'); 
    }); 
}); 




//Insert table
app.get('/insertorderhistory', (req, res) => { 
//    let post = {order_id:'#001', amount:4, state: 'shipped', timestamp: '2021-04-20 00:00:00', order_id:'#002', amount:5, state: 'shipped', timestamp: '2021-04-20 00:00:00',order_id:'#003', amount:2, state: 'shipped', timestamp: '2021-04-22 00:00:00', order_id:'#003', amount:2, state: 'shipped', timestamp: '2021-04-22 00:00:00', order_id:'#004', amount:1, state: 'shipped', timestamp: '2021-04-22 00:00:00', order_id:'#005', amount:1, state: 'packing', timestamp: '2021-04-23 00:00:00'}; 
    let values = [
        ['#001', 4, 'shipped', '2021-04-20 00:00:00'], 
        ['#002', 5, 'shipped', '2021-04-20 00:00:00'], 
        ['#003', 2, 'shipped', '2021-04-22 00:00:00'], 
        ['#004', 1, 'shipped', '2021-04-22 00:00:00'], 
        ['#005', 1, 'packing', '2021-04-23 00:00:00'], 

    ];
    let sql = 'INSERT INTO Order_History (order_id, amount, state, timestamp) VALUES ?'; 
    let query = db.query(sql, [values], (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('inserted...'); 
    });
});
app.get('/insertorderitem', (req, res) => { 
        let values = [
            ['laker jersey', 4], 
            ['spalding basketball', 5], 
            ['nets jersey', 2], 
            ['jazz jersey', 1], 
            ['lakers t-shirt', 1] 
    
        ];
        let sql = 'INSERT INTO Order_Item (order_item, quantity) VALUES ?'; 
        let query = db.query(sql, [values], (err, result) => {
            if(err) throw err; 
            console.log(result); 
            res.send('inserted...'); 
        });
    });
app.get('/insertorders', (req, res) => { 
    let values = [
        ['#001', '2021-04-20 00:00:00', 4, 'shipped'], 
        ['#002', '2021-04-20 00:00:00', 5, 'shipped'], 
        ['#003', '2021-04-22 00:00:00', 2, 'shipped'], 
        ['#004', '2021-04-22 00:00:00', 1, 'shipped'], 
        ['#005', '2021-04-23 00:00:00', 1, 'shipped'], 

    ];
    let sql = 'INSERT INTO Orders (order_id, order_date, total_amount, state) VALUES ?'; 
    let query = db.query(sql, [values], (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('inserted...'); 
    });
});    
app.get('/insertuseraccount', (req, res) => { 
    let values = [
        ['A001', 'oscarm', 'oscarp', '3474532464'], 
        ['A006', 'tommike', 'tomp', '5342446543'], 
        ['A003', 'jennifer22', 'jenniferp', '7453242341'], 
        ['A005', 'herbert1', 'herbertp', '3246453423'], 
        ['A004', 'jose90', 'josep', '3426432343']

    ];
    let sql = 'INSERT INTO User_Account (account_id, username, password, phone_number) VALUES ?'; 
    let query = db.query(sql, [values], (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('inserted...'); 
    });
});  
app.get('/insertaddress', (req, res) => { 
    let values = [
        ['Oscar Morales', '3451 Ave U', 'Brooklyn', 'New York', 11233], 
        ['Tom Mike', '5343 Ave M', 'Hawthorne', 'New Jersey', 43256], 
        ['Jennifer Lu', '3454 Ave L', 'Boston', 'Massachusetts', 43243], 
        ['Herbert Hoover', '3243 Ave P', 'Allentown', 'Pennsylvania', 65465], 
        ['Jose Tito', '9545 Ave K', 'Chicago', 'Illinois', 34346]

    ];
    let sql = 'INSERT INTO Address (name, street_address, city, state, zip) VALUES ?'; 
    let query = db.query(sql, [values], (err, result) => {
        if(err) throw err; 
        console.log(result); 
        res.send('inserted...'); 
    });
});  
app.get('/insertorderhistory', (req, res) => { 
        let values = [
            [241, '2021-01-02 00:00:00'], 
            [242, '2021-01-03 00:00:00'], 
            [243, '2021-01-04 00:00:00'], 
            [245, '2021-01-05 00:00:00'], 
            [246, '2021-01-06 00:00:00'] 
    
        ];
        let sql = 'INSERT INTO Invoice (invoice_id, creation_date) VALUES ?'; 
        let query = db.query(sql, [values], (err, result) => {
            if(err) throw err; 
            console.log(result); 
            res.send('inserted...'); 
    });
});
app.get('/insertinvoicehistory', (req, res) => { 
        let values = [
            [11,'2021-02-13 00:00:00','New York'],
            [22,'2021-03-14 00:00:00','New York'],
            [33,'2021-04-15 00:00:00','New Jersey'],
            [44,'2021-05-16 00:00:00','Boston'],
            [55,'2021-06-17 00:00:00','New Jersey']
    
        ];
        let sql = 'INSERT INTO Order_History (invoice_state_id, timestamp_date, state) VALUES ?'; 
        let query = db.query(sql, [values], (err, result) => {
            if(err) throw err; 
            console.log(result); 
            res.send('inserted...'); 
        });
    });
app.get('/insertcreditcard', (req, res) => { 
        let values = [
            [100, 222345666, 'Jake Miuke', '2025-01-03 00:00:00'], 
            [150, 23456678, 'Tomy Lue', '2021-01-04 00:00:00'], 
            [200, 456789765, 'Ali Salh', '2026-02-01 00:00:00'], 
            [300, 323456556, 'Joon Sin', '2027-03-01 00:00:00'], 
            [400, 234543456, 'Sam Aman', '2026-04-02 00:00:00'], 
        ];
        let sql = 'INSERT INTO Credit_card (credit_card_id, credit_card_num, holder_name, expire_date) VALUES ?'; 
        let query = db.query(sql, [values], (err, result) => {
            if(err) throw err; 
            console.log(result); 
            res.send('inserted...'); 
    });
});
app.get('/insertinvoice', (req, res) => { 
        let values = [
            [241,'2020-01-02 00:00:00'],
            [242,'2020-01-03 00:00:00'],
            [243,'2020-01-04 00:00:00'],
            [245,'2020-01-05 00:00:00'],
            [246,'2020-01-06 00:00:00']
        ];
        let sql = 'INSERT INTO Invoice (invoice_id, creation_date) VALUES ?'; 
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

app.listen('3001', () => { 
    console.log('Server started 3001');  
}); 