const SocketIO = require('socket.io');
const { characters, chats } = require('./models');

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

    socket.on('sendMessage', async data => {
      if (!req.session.userId) {
        socket.emit('notSession', { info: '세션 정보가 없습니다' });
        return;
      }

      if (data.roomname === '' || data.message === '') {
        socket.emit('emptyData', { info: '값을 넣어서 전달해 주세요' });
        return;
      }

      console.log('message: ', data);

      const character = await characters.findAll({
        where: { user_id: req.session.userId }
      });

      // 캐릭터가 있는 경우
      if (character[0]) {
        await chats.create({
          roomname: data.roomname,
          message: data.message,
          character_id: character[0].id
        });
        socket.emit('messageSuccess', { info: 'message success~' });
      }
      // 캐릭터가 없는 경우
      else {
        socket.emit('notCharacter', { info: '캐릭터가 없습니다' });
      }
    });
  });
};
