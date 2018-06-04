const basic = require('./basic')
const object = require('./object')
const list = require('./list')

const {pipe, isBasic, isObject, isList, check} = require('./checks')

const resolver = page => (key, value) => {
  return pipe(
    check(isBasic, basic(page, key)),
    check(isObject, object(page, key)),
    check(isList, list(page, key))
  )(value)
}

module.exports = resolver
