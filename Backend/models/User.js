const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');// utilisation du validateur unique

//Schema creation compte client avec adresse unique
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);