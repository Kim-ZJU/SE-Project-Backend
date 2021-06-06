const express = require('express');
const router = express.Router();
const db = require('../core/database');

/* GET users listing. */
router.get('/', async (req, res) => {
	res.send('ARTICLES: respond with a resource');
});

router.get('/init', async (req, res, next) => {
    const article = await db.articleModel.find({}).limit(10);
    if (!article.length) {
        return res.json({code: 404, message: 'not enough data'})
    }
    console.log(article)
    return res.json({code: 200, message: 'success', content: article})
});

router.post('/fetch', async (req, res) => {
    const {title} = req.body
    console.log(req.body)
	const article = await db.articleModel.find({title: title});
	if (!article.length) {
		return res.json({code: 404, message: 'file not existed'})
    }
    // console.log(article)
    return res.json({code: 200, message: 'success', content: article})
})

router.post('/search', async (req, res) => {
    const {title} = req.body
    console.log(req.body)
	const article = await db.articleModel.find(
        {$or: [
                {title:{$regex:title,$options:"$i"}},
                {article_content:{$regex:title,$options:"$i"}}
        ]});
	if (!article.length) {
		return res.json({code: 404, message: 'no matched file'})
    }
    console.log(article)
    return res.json({code: 200, message: 'success', content: article})
})

router.post('/insert', async function (req, res, next) {
	const {title, tag, date, image, article_content} = req.body;
	const doc = await db.articleModel({title, tag, date, image, article_content,likes:0}).save();
    console.log({title, tag, date, image, article_content, likes:0})
    if(doc){
        console.log(doc)
		return res.json({
			code: 200,
			msg: "success",
		})
    }
});

router.post('/comments/insert', async function (req, res, next) {
    const {articleID, user, date, context, status} = req.body;
	const doc = await db.commentModel({articleID, user, date, context, status}).save();
    console.log(req.body)
    if(doc){
		return res.json({
			code: 200,
			msg: "insert comment success",
		})
    }
    return res.json({code: 404, message: 'insert comment faliure'})
})

router.post('/comments/fetch', async (req, res) => {
    // fetch unreviewed comments
	const comments = await db.commentModel.find({status: 0});
	if (!comments.length) {
		return res.json({code: 404, message: 'no unreviewed comments'})
    }
    return res.json({code: 200, message: 'success', content: comments})
})

router.post('/comments/update', async (req, res) => {
    // update comment status
	const {commentID, status} = req.body;
    const doc = await db.commentModel.updateOne({_id: commentID}, {status: status});
    
    if(doc){
		return res.json({
			code: 200,
			msg: "update comment success",
		})
    }
    return res.json({code: 404, message: 'update comment faliure'})
})


module.exports = router;