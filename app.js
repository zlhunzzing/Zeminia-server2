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
const MySQLStore = require('express-mysql-session')(session);

require('dotenv').config();
const { sequelize } = require('./models');

//* routes
const usersRouter = require('./routes/users');
const charactersRouter = require('./routes/characters');
const monstersRouter = require('./routes/monsters');
const itemsRouter = require('./routes/items');
const logger = require('./logger');

const app = express();
sequelize.sync();
app.set('port', process.env.PORT || 5001);

const dbOptions = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};
const sessionStore = new MySQLStore(dbOptions);

const sessionMiddleware = session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // http
    maxAge: 36000000 // 단위: ms, 현재: 10시간, 참고(3600000 === 1h)
  },
  store: sessionStore
});

const WebSocket = require('./socket');

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
    origin: [
      'http://localhost:3000',
      'http://zeminia-client.s3-website.ap-northeast-2.amazonaws.com'
    ],
    methods: 'GET, POST, DELETE, PATCH, OPTIONS',
    credentials: true
  })
);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(process.env.SECRET_KEY));
app.use(sessionMiddleware);

// route middleware
app.use('/users', usersRouter);
app.use('/characters', charactersRouter);
app.use('/monsters', monstersRouter);
app.use('/items', itemsRouter);

// winston test
// app.get('/logger', (req, res, next) => {
//   logger.error('error~~ test');
//   next();
// });

app.use((req, res, next) => {
  const err = new Error('404 NOT FOUND');
  err.status = 404;
  logger.info('404 err');
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  logger.error(err.message);

  const message = req.app.get('env') === 'development' ? 'error~' : 'sorry';
  res.send(message);
});

const server = app.listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`server listen on ${app.get('port')}...`);
});

WebSocket(server, sessionMiddleware);
