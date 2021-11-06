import { parseString } from "xml2js";

// wrap the node style callback in a promise to make it easier to use with async/await

export default function readXml(xmlData) {
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
