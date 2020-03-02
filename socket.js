const SocketIO = require('socket.io');
const { Character, Chat } = require('./models');

module.exports = (server, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });

  io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  io.on('connection', socket => {
    console.log('클라인트에서 소켓을 접속하였습니다: ', socket.id);
    const req = socket.request;
    if (!req.session.userId) {
      console.log('세션 정보가 없습니다!');
    }

    console.log('req.session: ', req.session);

    socket.on('disconnect', () => {
      console.log('socket disconnect~~ : ', socket.id);
    });

    socket.on('error', err => {
      console.error(err);
    });
  });
};
