const { parseString } = require("xml2js");

// wrap the node style callback in a promise to make it easier to use with async/await

function readXml(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

module.exports = readXml;
