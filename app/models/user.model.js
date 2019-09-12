const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
		index:true
	},
	password: String
},{
	timestamps: true
})


//hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


module.exports = mongoose.model("User", UserSchema)