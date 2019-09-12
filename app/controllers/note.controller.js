const jwt = require('jsonwebtoken');
const Note = require('../models/note.model.js');

//Create and save a new note
exports.create = (req, res) => {

	error = []
	
	//validaton request
	if(!req.body.content){
		error.push("Content can't be empty")
	}

	
	if(error.length >0){
		res.send(error)
	}
	else{

		//Get User Email
		const usertoken = req.headers.authorization;
		const token = usertoken.split(' ');
		const decoded = jwt.verify(token[1], 'mysecretkey');
		const email = decoded.user.email;


		const note = new Note({
		title: req.body.title || "Untitle Note",
		content: req.body.content,
		userEmail: email
		});
		
		
		note.save()
		.then(data => {
			res.send(data)
		})
		.catch(err => {
			res.status(500).send({
				message: err.message || "Some problem occurred to save note"
			})
		})
	}
	
}



exports.findAll = (req, res) => {

	//Get user email
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'mysecretkey');
	const email = decoded.user.email;

	Note.find({ "userEmail": email })
	.then(notes => {
		res.send(notes)
	})
	.catch(err => {
		res.status(500).send({
			message: err.message || "Some problem to show all notes"
		})
	})
}


exports.singleNote = (req, res) => {

	//Get user email
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'mysecretkey');
	const email = decoded.user.email;

	Note.find({
		"_id": req.params.noteId,
		"userEmail": email

	})
	.then(note => {
		if(!note){
			res.status(404).send({
				message: "Note not found"
			})
		}
		else{
			res.send(note)
		}
	})
	.catch(err => {
		res.status(500).send({
			message: err.message || "Some problem to show this note"
		})
	})

}


//Update notes
exports.updateNote = (req, res) => {

	//Get user email
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'mysecretkey');
	const email = decoded.user.email;
	
	errors = []

	if(!req.body.content){
		errors.push("Body can't be empty")
	}

	if(errors.length > 0){
		res.send(errors)
	}
	else{
		Note.findOneAndUpdate(
			{ 
				"_id" : req.params.noteId,
				"userEmail" : email
			}, 
			{
				title: req.body.title || "Untitle",
				content: req.body.content,
				mobile: req.body.mobile
			},
			{
				new: true
			}
		)
		.then(data => {
			if(!data){
				res.status(404).send({
					message: "Note not found"
				})
			}
			else{
				res.send(data)
			}
		})
		.catch(err => {
			res.status(500).send({
				message: err.message || "Some problme to update notes"
			})
		})
	}
}

//Delete note
exports.deleteNote = (req, res) => {

	//Get user email
	const usertoken = req.headers.authorization;
	const token = usertoken.split(' ');
	const decoded = jwt.verify(token[1], 'mysecretkey');
	const email = decoded.user.email;


	Note.findOneAndDelete({
		"_id": req.params.noteId,
		"userEmail": email
	})
	.then(note=> {
		if(!note){
			res.status(404).send({
				message: "Note not found"
			})
		}
		else{
			res.send({
				message: "Successfully Deleted",
				note: note
			})
		}
	})
	.catch(err => {
		res.status(500).send({
			message: err.message || "Some problem to delete note"
		})
	})
}