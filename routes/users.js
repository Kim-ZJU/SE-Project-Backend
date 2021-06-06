const express = require('express');
const router = express.Router();
const db = require('../core/database');
const {sign} = require('../core/jwt');
const {verify} = require('../core/jwt');

router.post('/login', async (req, res) => {
	const {phoneNumber, password} = req.body;
	const user = await db.userModel.findOne({phoneNumber});
	if (!user) {
		return res.json({code: 404, message: 'user not found'})
	}
	if (user.password === password) {
		const token = sign({phoneNumber});
		const {role} = user;
		return res.json({code: 200, message: 'success', token, role});
	}
	return res.json({code: 400, message: 'bad req'})
});

router.post('/register', async (req, res) => {
	const {body} = req;
	const {phoneNumber} = body;
	const user = await db.userModel.findOne({phoneNumber});
	if (user) {
		return res.json({code: 404, message: 'user existed'})
	}
	const newUser = await db.userModel({...body}).save();
	const {role} = newUser;
	return res.json({code: 200, message: 'success', role, token: sign({phoneNumber})});
});

router.use('/', async (req, res, next) => {
	const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	if (!v) {
		return res.json({code: 400, message: 'wrong token'})
	}
	next();
});


router.get('/fetchUserInfo', async function (req, res, next) {

	const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
	const user = await db.userModel.findOne({phoneNumber});
	console.log(user);
	return res.json(
		{
			code: 0,
			message: 'success',
			data: user
		}
	)
});

router.get('/fetchCollections', async (req, res) => {
	const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;

	const articles = await db.userModel.findOne({phoneNumber}).populate('collections');
	return res.json({code: 200, message: 'success', content: articles.collections});
});

router.post('/update', async (req, res) => {
	const {body} = req;
	const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
	const user = await db.userModel.findOneAndUpdate({phoneNumber}, {...body});
	return res.json(
		{
			code: 0,
			message: 'success'
		}
	)
});

router.post('/healthfile/update', async (req, res) => {
	const {body} = req;
	const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
	const user = await db.userModel.findOneAndUpdate({phoneNumber}, {...body});
	return res.json(
		{
			code: 0,
			message: 'success'
		}
	)
});


router.post('/insert', async function (req, res, next) {
	const {name, studentId, gender, campus, dormitory, room, phoneNumber, password} = req.body;
	const doc = await db.userModel({name, studentId, gender, campus, dormitory, room, phoneNumber, password}).save();
	if (doc) {
		res.json({
			code: 0,
			msg: "success",
		})
	}
});

router.get('/healthfile/fetch', async (req, res) => {
	const {token} = req.headers;
	let v;
	try {
		v = await verify(token);
	} catch (e) {

	}
	const {phoneNumber} = v;
	const user = await db.userModel.findOne({phoneNumber});
	return res.json({
		code: 0,
		msg: 'success',
		data: user
	})
});

module.exports = router;
