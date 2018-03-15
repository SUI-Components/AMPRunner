// const log = require('debug')('amp:extractor:resolver:basic')

const basic = (page, tag) => async array => {
  const [query, mapper = e => e.innerText.trim()] = array
  const element = await page.$(query)

  if (!element) {
    return false
  }

  const text = await page.evaluate(mapper, element)
  await element.dispose()
  return text
}

module.exports = basic
