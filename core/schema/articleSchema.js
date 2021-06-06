const { Schema } = require('mongoose');

const articleSchema = new Schema({
    //article_ID: {type: Number, Default: 'article_ID'},
    title: {type: String, Default: 'title'},
    tag: {type: String, Default: 'tag'},
    date: {type: String, Default: 'date'},
    image: {type: String, Default: 'image'}, //应该是二进制类型，但是找不到这个类型
    article_content: {type: String, Default: 'article_content'},
    likes: {type: Number, Default: 0}
})

module.exports = articleSchema