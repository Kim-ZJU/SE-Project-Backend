const mongoose = require('mongoose')
const userSchema = require('./userSchema');
const articleSchema = require('./articleSchema');

exports.userModel = mongoose.model('user', userSchema);
exports.articleModel = mongoose.model('article', articleSchema);
