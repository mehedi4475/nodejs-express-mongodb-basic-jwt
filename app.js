//Include Express, MongoDB, Body Parser & JSON JWT

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

//Create Express New App
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


//Database Connect
dbConfig = require('./config/db.config.js')
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
})
.then(() => {
	console.log("Successfully Connect with Database")
})
.catch(err => {
	res.send(500).send({
		message: err.message || "Could not connect with Database"
	})
})


//Login and JWT Generate
//Username: mehedi
//Password: nopassword

app.post('/login', (req, res) => {
	if(req.body.username == 'mehedi' && req.body.password == 'nopassword'){
		const user = {
			id: 1,
			username: req.body.username,
			password: req.body.password
		}

		jwt.sign({ user: user }, 'mysecretkey', { expiresIn: 100 }, (err, token) => {
			res.json({
				token: token
			})
		})
	}
	else{
		res.send({
			message: "Username and Password not match"
		})
	}
})




//JWT Protected Area Start 
var verifyToken = function (req, res, next) {

	const bearerHeader = req.headers['authorization']

	if(typeof bearerHeader !== 'undefined'){
		const bearer = bearerHeader.split(' ')
		req.token = bearer[1]

		jwt.verify(req.token, 'mysecretkey', (err, authData) => {
			if(err){
				res.send(err.message)
				res.sendStatus(403)
			}
			else{
				next()
			}
		})		
	}
	else{
		res.sendStatus(403)
	}	
}


//This is the switch to ON/OFF Authentication  
app.use(verifyToken)


//Home Page, It's alwo authenticate area for demo/testing
app.get('/', (req, res) => {
	res.status(200).send({
		message: "Welcome to NodeJS"
	})
})

//Include routes file
require('./app/route/route.js')(app)

//Application run under 3000 ports
app.listen(3000, (req, res) => {
	console.log("NodeJS Running on port 3000")
})


//JWT Protected Area END 