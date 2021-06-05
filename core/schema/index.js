const mongoose = require('mongoose')
const userSchema = require('./userSchema');
const articleSchema = require('./articleSchema');
const commentSchema = require('./commentSchema');

exports.userModel = mongoose.model('user', userSchema);
exports.articleModel = mongoose.model('article', articleSchema);
exports.commentModel = mongoose.model('comment', commentSchema);
