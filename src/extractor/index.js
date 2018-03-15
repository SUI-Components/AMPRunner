const resolver = require('./resolver')

const kebakCaseToPascal = str =>
  str.replace(/(-\w)/g, match => match[1].toUpperCase())
const log = (...args) => console.log.apply(console, args)

module.exports = async ({ browser, url, queries }) =>
  new Promise(async (resolve, reject) => {
    let done = false
    const {
      __HEADERS__,
      __FORCE_SCROLL_TO__,
      __WaitFor__ = [],
      ...pageQueries
    } = queries
    try {
      const page = await browser.newPage()

      if (__HEADERS__) {
        page.setExtraHTTPHeaders(__HEADERS__)
      }

      await page.setRequestInterception(true)
      page.on('request', req => {
        const resourceUrl = req.url()

        if (resourceUrl.match(/tiqcdn/)) {
          log('Abort tealium URL', resourceUrl)
          return req.abort()
        }

        return req.continue()
      })

      await page.goto(url)

      if (__WaitFor__) {
        await Promise.all(
          __WaitFor__.map(selector => page.waitForSelector(selector))
        )
      }

      if (__FORCE_SCROLL_TO__) {
        const [toElement, ...waitElements] = __FORCE_SCROLL_TO__
        ;(await page.$(toElement)).hover().catch(log)
        const [head, ...tail] = waitElements
        if (typeof head === 'number') {
          await page.waitFor(head)
        } else {
          await Promise.all(
            [head, ...tail].map(element => page.waitForSelector(element))
          )
        }
      }

      const resolverPage = resolver(page)
      const values = await Promise.all(
        Object.keys(pageQueries).map(key =>
          Promise.resolve(resolverPage(key, pageQueries[key]))
        )
      )

      const data = Object.keys(pageQueries).reduce((acc, key, index) => {
        acc[kebakCaseToPascal(key)] = values[index]
        return acc
      }, {})

      done = true
      await page.close()
      return resolve(data)
    } catch (err) {
      !done && reject(err)
    }
  })
