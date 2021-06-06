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
    if(doc){
        console.log(doc)
		return res.json({
			code: 200,
			msg: "success",
		})
    }
});

router.post('/get_by_id', async (req, res) => {
    const {articleID} = req.body
    console.log(req.body)
	const article = await db.articleModel.findOne({_id: articleID});
	if (!article) {
		return res.json({code: 404, message: 'file not existed'})
    }
    return res.json({code: 200, message: 'success', content: article})
})

router.post('/mask', async function (req, res, next) {
    const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
    const user = await db.userModel.findOne({phoneNumber});

    const {articleID} = req.body;
    article = await db.articleModel.findOne({_id: articleID})

    // console.log(user)

    //! update user mark list 
    if (! user.mask.includes(article._id))
        user.mask.push(article._id)
    console.log(user.mask)
    const doc = await db.userModel(user).save();

    if(doc){
        console.log(doc)
        return res.json({
            code: 200,
            msg: "success",
        })
    }
    
    return res.json({code: 404, message: 'like faliure'})
});
router.post('/like', async function (req, res, next) {
    const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
    const user = await db.userModel.findOne({phoneNumber});
    // const user = await db.userModel.findOne({phoneNumber:"1"});
    // console.log(user)

    //! update article likes
    const {articleID, status} = req.body;
    article = await db.articleModel.findOne({_id: articleID})
    new_likes = article.likes + 1
    // console.log(new_likes)
    const doc = await db.articleModel.updateOne({_id: articleID}, {likes: new_likes});

    if(doc){
        //! update user likes list 
        if (! user.collections.includes(article._id))
            user.collections.push(article._id)
        // console.log(user.collections)
        const udoc = await db.userModel(user).save();

        if(udoc){
            // console.log(udoc)
            return res.json({
                code: 200,
                msg: "success",
            })
        }
    }
    return res.json({code: 404, message: 'like faliure'})
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