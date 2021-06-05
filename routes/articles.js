const express = require('express');
const router = express.Router();
const db = require('../core/database');

/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('ARTICLES: respond with a resource');
});

router.post('/', async (req, res) => {
    res.send('ARTICLES: test post');
    // return res.json({code: 400, message: 'bad req'})
})

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
	const doc = await db.articleModel({title, tag, date, image, article_content}).save();
    console.log(req.body)
    if(doc){
		res.json({
			code: 0,
			msg: "success",
		})
	}
});

module.exports = router;