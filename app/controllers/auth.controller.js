const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const MongoClient = require('mongodb').MongoClient;
const dbConfig = require('../../config/database.config.js');
const bcrypt = require('bcrypt')


//Login and Generate JWT
exports.login = (req, res) => {

	MongoClient.connect(dbConfig.url, function(err, db) {
	  var dbo = db.db("test");
	  var query = {
	   		email: req.body.email
		};
	    
	    dbo.collection("users").find(query).toArray(function(err, result) {

	    if(result.length == 0 || result.length > 1){
	    	return res.send("Username & Email not match")
	    }
	    else{
	    	let pass = result[0].password

		    if(bcrypt.compareSync(req.body.password, pass)) {		 	
				
				const user = {
					id : result[0].id,
					email: req.body.email,
					password: req.body.password
				}

				jwt.sign({user:user}, 'mysecretkey', { expiresIn:3000 }, (err, token) => {
					res.json({
						token: token
					})
				})

			} else {
			 	res.send("Some error to login")
			}
	    }   
	    db.close();
	  });
	});	

}


//User Registration
exports.registration = (req, res) => {

	errors = []

	if(!req.body.email){
		errors.push("Email required")
	}

	if(!req.body.password){
		errors.push("Password required")
	}

	if(errors.length > 0){
		res.send(errors)
	}
	else{
		
		const user = new User({
			email: req.body.email,
			password: req.body.password
		});

		user.save()
		.then(data => {
			res.send(data)
		})
		.catch(err => {
			res.status(500).send({
				message: err.message || "Some problem to registration now"
			})
		})
	}
}