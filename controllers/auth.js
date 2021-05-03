const mysql = require("mysql"); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
const db = mysql.createConnection({
          host    : process.env.DATABASE_HOST, 
          user    : process.env.DATABASE_USER, 
          password: process.env.DATABASE_PASSWORD,   
          database: process.env.DATABASE
});
//login credentials must match what is in User_Account table in database 
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body; 

       // if(!username || password ) {
       //     return res.status(400).render('login', {
       //         message: 'Please provide both'
       //     })
       // }

       db.query('SELECT * FROM User_Account WHERE username = ?', [username], async (error, results) => {
        console.log(results);     
        if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Credentials are incorrect'
                })
            } else {
                const user = results[0].user; 
                const token = jwt.sign({user: username }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }); 

                console.log("the token is: " + token); 
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ), 
                    httpOnly: true
                }
                res.cookie('jwt', token, cookieOptions); 
                res.status(200).redirect("/"); 
            }
       })

    } catch (error) {
        console.log(error);   
    }
}


//add credentials to database when user registers 
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
        } else if (password !== passwordConfirm ) { //both inputs must match 
            return res.render('register', {
                message: 'Passwords do not match'
            }); 
        }
        let hashedPassword = await bcrypt.hash(password, 8); //password is encrypted 
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