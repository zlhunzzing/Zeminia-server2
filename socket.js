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
  let getChats = null;

  if (roomname) {
    getChats = await chats.findAll({
      include: [{ model: characters }],
      where: { roomname }
    });
  } else {
    getChats = await chats.findAll({
      include: [{ model: characters }]
    });
  }

  // 콘솔로 찍어보면 characters 를 사용하려면 character 로 해야 한다.
  // row.characters 로 하면 값을 찾지를 못한다, character. 으로 찾아야 한다.
  // 왜 그런 지 알 수 없다...
  // console.log('getChats...', getChats);
  // dataValues: {
  //   id: 3,
  //   character_id: 1,
  //   message: 'gggg',
  //   roomname: 'seoul',
  //   createdAt: 2020-03-03T04:48:11.000Z,
  //   updatedAt: 2020-03-03T04:48:11.000Z,
  //   character: [characters]
  // },

  const result = getChats.map(row => {
    return {
      id: row.id,
      message: row.message,
      roomname: row.roomname,
      character: row.character.character_name,
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

  io.on('connection', async socket => {
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
    socket.on('uniqRoomInit', async () => {
      socket.emit('uniqRoomInit', await uniqRoomFilter());
    });

    socket.on('allMessages', async () => {
      socket.emit('allMessages', await filterRoom());
    });

    socket.on('filterRoom', async roomname => {
      socket.emit('filterRoom', await filterRoom(roomname));
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

      // 방에 접속
      socket.join(data.roomname);

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

        uniqRoomFilter().then(rooms => {
          socket.emit('uniqRooms', rooms);
          socket.broadcast.emit('uniqRooms', rooms);
        });

        filterRoom(data.roomname).then(row => {
          socket.emit('filterRoom', row);
          socket.to(data.roomname).emit('filterRoom', row);
        });
      }
      // 캐릭터가 없는 경우
      else {
        socket.emit('notCharacter', { info: '캐릭터가 없습니다' });
      }
    });
  });
};
