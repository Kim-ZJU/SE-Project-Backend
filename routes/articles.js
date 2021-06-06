const express = require('express');
const router = express.Router();
const db = require('../core/database');
const { sign, verify } = require('../core/jwt');

/* GET users listing. */
router.get('/', async (req, res) => {
	res.send('ARTICLES: respond with a resource');
});

router.get('/init', async (req, res, next) => {
    const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
    const user = await db.userModel.findOne({phoneNumber});

    const article = await db.articleModel.find({}).limit(10);
    if (!article.length) {
        return res.json({code: 404, message: 'not enough data'})
    }
    for(var i = 0; i < article.length; i++){
        if (user.mask.includes(article[i]._id)){
            article.splice(i, 1);
        }
    }
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

router.post('/get_by_name', async (req, res) => {
    const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
    const user = await db.userModel.findOne({phoneNumber});

    const {title} = req.body
    console.log(req.body)
	const article = await db.articleModel.findOne({title: title});
	if (!article) {
		return res.json({code: 404, message: 'file not existed'})
    }
    like = user.collections.includes(article._id)
    favorite = user.favorite.includes(article._id)
    mask = user.mask.includes(article._id)

    // get comments
	const comments = await db.commentModel.find({articleID: article._id});
    
    return res.json({code: 200, message: 'success', content: article, 
        is_like:like, is_favorite:favorite, is_mask:mask, comments: comments})
})

router.post('/get_by_id', async (req, res) => {
    const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
    const user = await db.userModel.findOne({phoneNumber});

    const {articleID} = req.body
    console.log(req.body)
	const article = await db.articleModel.findOne({_id: articleID});
	if (!article) {
		return res.json({code: 404, message: 'file not existed'})
    }
    like = user.collections.includes(articleID)
    favorite = user.favorite.includes(articleID)
    mask = user.mask.includes(articleID)
    
    return res.json({code: 200, message: 'success', content: article, 
        is_like:like, is_favorite:favorite, is_mask:mask})
})

router.post('/favorite', async function (req, res, next) {
    const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
    const user = await db.userModel.findOne({phoneNumber});

    const {articleID, status} = req.body;
    article = await db.articleModel.findOne({_id: articleID})

    if(article.length == 0){
        return res.json({code: 404, message: 'favorite faliure: no such file'})
    }

    //! update user favorite list 
    var flag = 0
    if (status == 1) // mark
    {
        if (! user.favorite.includes(articleID)){
            flag = 1
            user.favorite.push(articleID)
        }
    }
    else if (status == 0){ // unmark
        for(var i = 0; i < user.favorite.length; i++){
            if (user.favorite[i] == articleID){
                user.favorite.splice(i, 1);
                flag = 1;
            }
        }
    }

    if(!flag) return res.json({
        code: 200,
        msg: "success: no need to update",
    })

    console.log(user.favorite)
    const doc = await db.userModel(user).save();

    if(doc){
        console.log(doc)
        return res.json({
            code: 200,
            msg: "favorite success",
        })
    }
    
    return res.json({code: 404, message: 'favorite faliure'})
});

router.post('/mask', async function (req, res, next) {
    const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
    const user = await db.userModel.findOne({phoneNumber});

    const {articleID, status} = req.body;
    article = await db.articleModel.findOne({_id: articleID})

    if(article.length == 0){
        return res.json({code: 404, message: 'mask faliure: no such file'})
    }

    //! update user mark list 
    var flag = 0
    if (status == 1) // mark
    {
        if (! user.mask.includes(articleID)){
            flag = 1
            user.mask.push(articleID)
        }
    }
    else if (status == 0){ // unmark
        for(var i = 0; i < user.mask.length; i++){
            if (user.mask[i] == articleID){
                user.mask.splice(i, 1);
                flag = 1;
            }
        }
    }

    if(!flag) return res.json({
        code: 200,
        msg: "success: no need to update",
    })

    console.log(user.mask)
    const doc = await db.userModel(user).save();

    if(doc){
        console.log(doc)
        return res.json({
            code: 200,
            msg: "mask success",
        })
    }
    
    return res.json({code: 404, message: 'mask faliure'})
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

    //! update article likes
    const {articleID, status} = req.body;
    article = await db.articleModel.findOne({_id: articleID})
    if(article.length == 0){
        return res.json({code: 404, message: 'mask faliure: no such file'})
    }
    var flag = 0
    if (status == 1){
        if (! user.collections.includes(article._id)){
            new_likes = article.likes + 1
            flag = 1
        }
    }
    else{
        if (user.collections.includes(article._id)){
            new_likes = article.likes - 1
            flag = 1
        }   
    }
    // console.log(new_likes)
    if(!flag) return res.json({
        code: 200,
        msg: "success: no need to update",
    })

    const doc = await db.articleModel.updateOne({_id: articleID}, {likes: new_likes});

    if(doc){
        console.log(status)
        //! update user likes list 
        if (status == 1) // like
        {
            if (! user.collections.includes(article._id))
                user.collections.push(article._id)
        }
        else if (status == 0){ // unlike
            for(var i = 0; i < user.collections.length; i++){
                if (user.collections[i] == articleID){
                    user.collections.splice(i, 1);
                }
            }
        }

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