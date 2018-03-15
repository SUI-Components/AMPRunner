const removeSymFactory = sym => str => str.replace(sym, '')

const cleaner = ({ data, sym = '!' } = {}) => {
  const removeSym = removeSymFactory(sym)
  return Object.keys(data).reduce((acc, key) => {
    if (typeof data[key] === 'string') {
      acc[removeSym(key)] = data[key]
    }

    if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
      acc[removeSym(key)] = cleaner({ data: data[key], sym })
    }

    if (Array.isArray(data[key])) {
      acc[removeSym(key)] = data[key].map(o => cleaner({ data: o, sym }))
    }

    return acc
  }, {})
}

module.exports = cleaner
