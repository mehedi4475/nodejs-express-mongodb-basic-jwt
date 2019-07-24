const Note = require('../model/note.model.js')

exports.createNote = (req, res) => {
	if(!req.body.content){
		res.send({
			message: "Content can't be empty"
		})
	}
	else{
		const note = new Note({
			title: req.body.title || "Untitled",
			content: req.body.content
		})

		note.save()
		.then(data => {
			res.send(data)
		})
		.catch(err => {
			res.status(500).send({
				message: err.message || "Can't create note now, please try again later"
			})
		})
	}

}

exports.showAllNotes = (req, res) => {
	Note.find()
	.then(data => {
		res.send(data)
	})
	.catch(err => {
		res.status(500).send({
			message: err.message || "Can't show all notes now, please try again later"
		})
	})
}

exports.singleNote = (req, res) => {
	Note.findById(req.params.noteId)
	.then(data => {
		res.send(data)
	})
	.catch( err => {
		res.status(500).send({
			message: err.message || "Can't find this id"
		})
	})
}

exports.updateNote = (req, res) => {
	if(!req.body.content){
		res.send({
			message: "Please add content value"
		})
	}
	else{
		Note.findByIdAndUpdate(req.params.noteId, {
			title: req.body.title || "Untitled",
			content: req.body.content
		},{
			new: true
		})
		.then(data => {
			res.send(data)
		})
		.catch(err => {
			res.status(5000).send({
				message: err.message || "Could not update now, pelase try again later"
			})
		})


	}
}

exports.deleteNote = (req, res) => {
	Note.findByIdAndRemove(req.params.noteId)
	.then(note => {
		if(!note){
			res.send({
				message: "Note Note found"
			})
		}
		else{
			res.send({
				message: "Successfully deleted"
			})
		}

		
	})
	.catch( err => {
		res.status(500).send({
			message: err.message || "Can't delete now"
		})
	})
}