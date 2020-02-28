const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const path = require('path');

require('dotenv').config();
const { sequelize } = require('./models');

//* routes
const usersRouter = require('./routes/users');
const charactersRouter = require('./routes/characters');

const app = express();
sequelize.sync();
app.set('port', process.env.PORT || 5001);

if (process.env.NODE_ENV === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(helmet());
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}

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

app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`server listen on ${app.get('port')}...`);
});
