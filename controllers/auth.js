const mysql = require("mysql"); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
const db = mysql.createConnection({
          host    : process.env.DATABASE_HOST, 
          user    : process.env.DATABASE_USER, 
          password: process.env.DATABASE_PASSWORD,   
          database: process.env.DATABASE
});

exports.register = (req, res) => {
    console.log(req.body);
    
    const { username, password, passwordConfirm, phone_number} = req.body;
    
    db.query('SELECT username FROM User_Account WHERE username = ?', [username], async (error, results) => {
        if(error) {
            console.log(error); 
        }
        if(results.length > 0) {
            return res.render('register', {
                message: 'That username is already taken'
            })
        } else if (password !== passwordConfirm ) {
            return res.render('register', {
                message: 'Passwords do not match'
            }); 
        }
        let hashedPassword = await bcrypt.hash(password, 8); 
        console.log(hashedPassword); 

        db.query('INSERT INTO User_Account SET ?', {username: username, password: hashedPassword, phone_number: phone_number}, (error, results) => {
            if(error) {
                console.log(error); 
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'User registered'
                })
            }
        })
    });   
}