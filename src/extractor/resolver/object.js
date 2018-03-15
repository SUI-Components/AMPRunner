const log = require('debug')('amp:extractor:resolver:object')

module.exports = (page, container) => async queries => {
  const head = arr => arr[0]
  return (await Promise.all(
    Object.keys(queries).map(async query => {
      return page
        .$eval(
          query,
          (element, mapper) => {
            const innerMapper = Function(`return (${mapper})(arguments[0])`) // eslint-disable-line
            const withNode = fn => node =>
              node ? fn(node) : { [Object.keys(fn({}))[0]]: false }
            return withNode(innerMapper)(element)
          },
          `${queries[query]}`
        )
        .catch(err => {
          log(err)
          return { [head(Object.keys(queries[query]({})))]: false }
        })
    })
  )).reduce((acc, obj) => ({ ...acc, ...obj }), {})
}
