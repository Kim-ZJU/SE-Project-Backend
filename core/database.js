const mongoose = require('mongoose');
const db = require('./schema');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/testDB', {useNewUrlParser: true, useUnifiedTopology: true});
const conn = mongoose.connection;
conn.on('error', console.error.bind(console, 'connection error'));
conn.once('open', () => {
  console.log("connected");
});

module.exports = db;


