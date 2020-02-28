const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();
const port = 5001;
sequelize.sync();

// usersRouter 를 사용해서 미들웨어 라우팅 설정
const usersRouter = require('./routes/users');
const charactersRouter = require('./routes/characters');

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, DELETE, PATCH, OPTIONS',
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.SECRET_KEY));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false // http
    }
  })
);

app.use('/users', usersRouter);
app.use('/characters', charactersRouter);

// Todo: 404, 500 error 미들웨어 만들기

app.listen(port, () => {
  console.log(`server listen on ${port}`);
});
