const head = arr => arr[0]

exports.pipe = (...funcs) => arg =>
  funcs.reduce((value, func) => func(value), arg)

exports.isBasic = value =>
  Array.isArray(value) && typeof head(value) === 'string'

exports.isObject = value =>
  typeof value === 'object' &&
  typeof value.then !== 'function' &&
  !Array.isArray(value)

exports.isList = value =>
  Array.isArray(value) && typeof head(value) === 'object'

exports.check = (match, transformation) => value =>
  match(value) ? transformation(value) : value
