const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 5001;

// usersRouter 를 사용해서 미들웨어 라우팅 설정
const usersRouter = require('../routes/users');

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET, POST, DELETE, PATCH, OPTIONS',
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Todo : dotenv 에 시크릿키 작성하기
app.use(cookieParser('@cute*cat'));
app.use(
  session({
    secret: '@cute*cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false // http
    }
  })
);

app.use('/users', usersRouter);

// Todo: 404, 500 error 미들웨어 만들기

app.listen(port, () => {
  console.log(`server listen on ${port}`);
});
