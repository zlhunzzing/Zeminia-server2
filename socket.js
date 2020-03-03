const SocketIO = require('socket.io');
const { characters, chats } = require('./models');

// select options 에 넣을 방 이름들 (중복 제거)
// ['seoul', 'busan', 'seoul', 'busan']  -> ['busan', 'seoul']
const uniqRoomFilter = async () => {
  // https://stackoverflow.com/questions/41519695/how-to-get-a-distinct-value-of-a-row-with-sequelize
  // [{DISTINCT: 'default', DISTINCT: 'seoul', ...}]
  const distinctRooms = await chats.aggregate('roomname', 'DISTINCT', {
    plain: false
  });

  // ['default', 'seoul', ...]
  const getRoooms = distinctRooms.map(room => {
    return room.DISTINCT;
  });

  return getRoooms;
};

// 'seoul' 에 해당하는 방의 데이터 가져오기
const filterRoom = async roomname => {
  const getChats = await chats.findAll({
    include: [characters],
    where: { roomname }
  });

  const result = getChats.map(row => {
    return {
      id: row.id,
      message: row.message,
      roomname: row.roomname,
      character: row.Character.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt
    };
  });

  return result;
};

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

    // select options에 넣을 중복없는 방 이름 전달하기
    socket.on('uniqRoomInit', () => {
      uniqRoomFilter().then(rooms => {
        socket.emit('uniqRoomInit', rooms);
      });
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
          roomname: data.roomname.trim(),
          message: data.message.trim(),
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
