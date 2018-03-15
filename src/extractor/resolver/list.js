module.exports = (page, container) => async array => {
  const [queries] = array

  const base = await Promise.all(
    Object.keys(queries).map(async query => {
      return await page.$$eval(
        query,
        (elements, mapper) => {
          return Promise.all(
            Array.from(elements).map(element => {
              return Function(`return (${mapper})(arguments[0])`)(element) // eslint-disable-line
            })
          )
        },
        `${queries[query]}`
      )
    })
  )

  var head = array => array[0]
  var maxIndex = base => Math.max.apply(null, base.map(arr => arr.length))
  var nonExist = j => ({
    [head(Object.keys(queries[Object.keys(queries)[j]]({})))]: false // https://goo.gl/NYgL7H
  })
  return Array.apply(null, Array(maxIndex(base))).map((_, index) => {
    return base.reduce((acc, arr, j) => {
      return {
        ...acc,
        ...(arr[index] || nonExist(j))
      }
    }, {})
  })
}
