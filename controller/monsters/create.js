const { monsters } = require('../../models');

module.exports = {
  post: async (req, res, next) => {
    try {
      const { monster_name, level, hp, att, exp } = req.body;
      const options = { monster_name, level, hp, att, exp };
      await monsters.create(options);
      res.status(200).send({ monsterCreate: 'Success' });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      next();
    }
  }
};
