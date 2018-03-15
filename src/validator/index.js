const filter = require('just-filter')
const flatten = require('just-flatten-it')

const sanitize = obj => {
  const falses = Object.keys(obj).reduce((acc, key) => {
    !obj[key] && (acc[key] = false)

    Array.isArray(obj[key]) &&
      (acc[key] = obj[key]
        .map(sanitize)
        .filter(obj => !!Object.keys(obj).length))

    typeof obj[key] === 'object' &&
      !Array.isArray(obj[key]) &&
      (acc[key] = Object.keys(sanitize(obj[key])).length
        ? sanitize(obj[key])
        : undefined)

    return acc
  }, {})

  return filter(
    falses,
    (k, v) => (Array.isArray(v) ? !!v.length : v !== undefined)
  )
}

const importants = (parent = '.') => obj => {
  return flatten(
    Object.keys(obj).map(key => {
      const value = obj[key]
      const isImportant = key[key.length - 1] === '!'

      if (Array.isArray(value)) {
        return value.map(importants(`${key}.`))
      }

      if (typeof value === 'object' && !Array.isArray(value)) {
        return importants(`${key}.`)(value)
      }

      return isImportant ? `${parent}${key}` : undefined
    })
  ).filter(Boolean)
}

exports.sanitize = sanitize
exports.importants = importants()
