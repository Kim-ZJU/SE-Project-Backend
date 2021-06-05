const { Schema } = require('mongoose');

const commentSchema = new Schema({
    articleID: {type: String, Default: 'articleID'},
    user: {type: String, Default: 'user'},
    date: {type: String, Default: 'date'},
    context:{type: String, Default: 'context'},
    status: {type: Number}, // 0未审核 1通过 2不通过
})

module.exports = commentSchema