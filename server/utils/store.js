const fs = require("fs");
const { parse } = require("csv-parse");
const _ = require("lodash");
const { FINAL_FIELD_NAME } = require("./constants");

class Store {
  constructor() {
    this._constuctions = [];
  }

  async initialize(filePath) {
    return new Promise((res, rej) => {
      if (filePath) {
        let parser = parse({ columns: true }, (err, data) => {
          this._constuctions = data;
          res(data);
        });
        fs.createReadStream(filePath).pipe(parser);
      } else {
        res([]);
      }
    });
  }

  getNextField(currentFieldName, selectedOptions) {
    if (!this._constuctions?.length) return [];
    let fieldName = currentFieldName;
    let options = [];

    while (!this._isFinalField(fieldName)) {
      fieldName = this._getNextFieldName(fieldName);
      options = this._getAvailableOptionsForField(fieldName, selectedOptions);

      if (options.length > 1 || (options.length === 1 && options[0] !== ""))
        break;
    }

    return { name: fieldName, options };
  }

  _getNextFieldName(currentFieldName) {
    if (!currentFieldName) return _.keys(this._constuctions[0])[0];

    return _.chain(this._constuctions[0])
      .keys()
      .dropWhile((fieldName) => fieldName !== currentFieldName)
      .value()[1];
  }

  _getAvailableOptionsForField(fieldName, selectedOptions) {
    if (!this._constuctions?.length) return [];

    return _.chain(this._constuctions)
      .filter(selectedOptions)
      .map(fieldName)
      .uniq()
      .value();
  }

  _isFinalField(field) {
    return field === FINAL_FIELD_NAME;
  }
}

const globalStore = new Store();

module.exports = { globalStore };
