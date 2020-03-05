const { items } = require('../../models');

module.exports = {
  get: async (req, res, next) => {
    try {
      const info = await items.findAll();
      if (info[0]) {
        const mapData = info.map(item => item.dataValues);
        res.status(200).send(mapData);
      } else {
        res.status(404).send({ noneItems: true });
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
