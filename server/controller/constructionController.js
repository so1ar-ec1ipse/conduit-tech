const { globalStore } = require("../utils/store");

function getNextField(req, res) {
  const { currentField, selectedOptions } = req.query;

  return res.json(globalStore.getNextField(currentField, selectedOptions));
}

module.exports = {
  getNextField,
};
