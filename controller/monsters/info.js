const { monsters } = require('../../models');

module.exports = {
  get: async (req, res, next) => {
    try {
      const villain = await monsters.findAll();

      if (villain[0]) {
        const mapData = villain.map(el => el.dataValues);
        res.status(200).send(mapData);
      } else {
        res.status(404).send('어떠한 몬스터도 저장되어 있지 않습니다.');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
