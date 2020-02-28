const { characters } = require('../../models');

module.exports = {
  get: async (req, res, next) => {
    try {
      let chars = await characters.findAll();

      // 데이터베이스에 캐리터가 하나라도 있을경우
      if (chars[0]) {
        let mapData = chars.map(info => info.dataValues);
        mapData.sort((a, b) => b.rankScore - a.rankScore);
        res.status(200).send(mapData);
      } else {
        // 데이터베이스에 캐릭터가 하나도 없을경우
        res
          .status(404)
          .send('데이터베이스에 어떠한 캐릭터도 존재하지 않습니다.');
      }
    } catch (err) {
      console.log(err);
      next();
    }
  }
};
