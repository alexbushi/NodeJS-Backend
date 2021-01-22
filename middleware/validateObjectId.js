const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('The object with the given ID does not exist');
};
