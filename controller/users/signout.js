module.exports = {
  post: (req, res) => {
    if (req.session.userSess === req.session.id) {
      req.session.destroy();
      res.json({ signoutCheck: 'success' });
    } else {
      res.json({ signoutCheck: 'failed' });
    }
  }
};
