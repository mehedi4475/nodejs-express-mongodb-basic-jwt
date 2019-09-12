//Import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



//Create an express app
const app = express();


//Body Parser JSON data
app.use(bodyParser.urlencoded({ extended:true }))
app.use(bodyParser.json())



//Connect to database
mongoose.Promise =global.Promise;
const dbConfig = require('./config/database.config.js');
mongoose.connect(dbConfig.url, {
	useNewUrlParser: true
}).then( ()=> {
	console.log("Successfully connected to the database");
}).catch(err => {
	console.log("Could not connect with database.", err)
	process.exit();
})



//Welcome Route
require('./app/routes/home.routes.js')(app);
require('./app/routes/auth.routes.js')(app);



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
//After this line all code will be verifyToken
app.use(verifyToken)


//Add route
require('./app/routes/note.routes.js')(app);


//Server listening at 3000 port
app.listen(3000, () => {
	console.log("Server is listening on port 3000");
})