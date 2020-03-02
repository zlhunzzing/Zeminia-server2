const { characters } = require('../../models');

module.exports = {
  post: async (req, res, next) => {
    try {
      // session.userId 로 새로운 캐릭터 생성
      if (req.session.userId) {
        //   db 생성 옵션
        const options = {
          user_id: req.session.userId,
          character_name: req.body.character_name
        };
        // 새 캐릭터 생성
        const newCharacter = await characters.create(options);
        // 새 캐릭터 id로 조회후 저장
        const sendData = await characters.findOne({
          where: { id: newCharacter.id }
        });
        // res.status(200).send(newCharacter.dataVales);
        res.status(200).send(sendData.dataValues);
      } else {
        res.status(401).send({ failed: '인증되지 않은 사용자 입니다.' });
      }
      // 새로운 캐릭터 생성후, response
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
