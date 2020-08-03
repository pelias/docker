const _ = require('lodash')
const Document = require('pelias-model').Document

module.exports.marshal = (doc) => {
  return doc
}

module.exports.unmarshal = (data) => {

  // assign document prototype
  // let doc = new Document(data.source, data.layer, data.source_id)
  // doc = _.merge(doc, data)

  let doc = Object.setPrototypeOf(data, Document.prototype)

  // create a non-enumerable property for metadata
  Object.defineProperty(doc, '_meta', { writable: true, value: {} });

  // create a non-enumerable property for post-processing scripts
  Object.defineProperty(doc, '_post', { writable: true, value: [] });

  return doc
}
