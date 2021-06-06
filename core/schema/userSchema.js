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
	role: {type: String, enum: ['student', 'doctor']},

	//以下是healthfile
	blood: {type: String, enum: ['A', 'B', 'O', 'AB']},
	height: {type: Number},
	weight: {type: Number},
	bloodRH: {type: String, enum: ['是', '否', '不详']},
	bust: {type: Number},
	waist: {type: Number},
	hipline: {type: Number},
	systolic: {type: Number},
	diastolic: {type: Number},
	allergy: {type: String, enum: ['是', '否', '不详']},
	inheritance: {type: String, enum: ['是', '否', '不详']},

	collections: [{type: Schema.Types.ObjectId,ref: 'article'}], // likes
	mask: [{type: Schema.Types.ObjectId,ref: 'article'}], // mask
	favorites: [{type: Schema.Types.ObjectId,ref: 'article'}] // favorites
	
});


module.exports = userSchema;
