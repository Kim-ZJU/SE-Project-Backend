const express = require('express');
const router = express.Router();
const db = require('../core/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const doc = await db.userModel.findOneAndUpdate({name: 'SE'}, {password: Date.now()}, { upsert: true});
  console.log(doc);
  res.send("helloWorld")
});

module.exports = router;
