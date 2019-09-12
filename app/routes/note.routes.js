module.exports = (app) => {
	const mynotes = require('../controllers/note.controller.js');

	//Create a new note
	app.post('/notes', mynotes.create);

	//Find All
	app.get('/notes', mynotes.findAll)


	//Single Note
	app.get('/notes/:noteId', mynotes.singleNote)


	//Update note
	app.put('/notes/:noteId', mynotes.updateNote)


	//Delete Notes
	app.delete('/notes/:noteId', mynotes.deleteNote)
}