module.exports = (app) => {

	const auth = require('../controllers/auth.controller.js');

	app.post('/login', auth.login)

	app.post('/registration', auth.registration)
}