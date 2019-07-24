module.exports = (myApp) => {
	const myController = require('../controller/note.controller.js')
	myApp.post('/notes', myController.createNote)
	myApp.get('/notes', myController.showAllNotes)
	myApp.get('/notes/:noteId', myController.singleNote)
	myApp.put('/notes/:noteId', myController.updateNote)
	myApp.delete('/notes/:noteId', myController.deleteNote)
}