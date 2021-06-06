const { Schema } = require('mongoose');

const articleSchema = new Schema({
    title: {type: String, Default: 'title'},
    tag: {type: String, Default: 'tag'},
    date: {type: String, Default: 'date'},
    image: {type: String, Default: 'image'},
    article_content: {type: String, Default: 'article_content'},
    likes: {type: Number, Default: 0}
})

module.exports = articleSchema