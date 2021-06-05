const {Schema} = require('mongoose');

const userSchema = new Schema({
	studentId: {type: String},
	age: {type: Number},
	name: {type: String}, //真实姓名
	password: {type: String, Default: 'passwd'},
	gender: {type: String, enum: ['男', '女']},
	phoneNumber: {type: String}, //手机号作为唯一id
	campus: {type: String, enum: ['紫金港', '玉泉', '西溪', '华家池', '之江', '海宁', '舟山']},
	dormitory: {type: String},
	room: {type: String},
	role: {type: String, enum: ['student', 'doctor']}
});


module.exports = userSchema
