const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const { verify } = require('./core/jwt');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');

const app = express();

app.use(logger('dev'));
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({ limit:'100mb', extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));
app.use(bodyParser.json({limit:'100mb'}));

//users 有登录，因此在router里鉴权
app.use('/users', usersRouter);
app.use('/', async (req, res, next) => {
  const {token} = req.headers;
  let v;
  try {
    v = await verify(token);
  }
  catch (e) {
    // console.log(e);
  }
  if (!v) {
    return res.json({code: 400, message: 'wrong token'})
  }
  res.tokenPayload = v;
  next();
});

//其余路由在鉴权之后定义
app.use('/articles', articlesRouter);

app.use('/', indexRouter);

module.exports = app;
