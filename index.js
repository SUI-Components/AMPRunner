#!/usr/bin/env node

const express = require('express')
const requireFromString = require('require-from-string')
const initBrowser = require('./src/browser')
const extractor = require('./src/extractor')
const fetcher = require('./src/fetcher')
const generator = require('./src/generator')
const { sanitize, importants } = require('./src/validator')

const app = express()

const { PORT = 3000 } = process.env

app.get('/', (req, res) => res.send({ status: 'OK', timestamp: Date.now() }))

app.get('/amp/**', async (req, res) => {
  const browser = await initBrowser()
  const url = req.params[0]
  const org = req.query.organization
  const pkg = req.query.package
  const ver = req.query.version

  try {
    const [qs, template, post] = await fetcher({ org, pkg, ver })
    const queries = requireFromString(qs)
    const postprocessing = requireFromString(post)
    const obj = await extractor({ browser, queries, url })

    const missings = importants(sanitize(obj))
    if (missings.length !== 0) {
      return res.status(404).json(missings)
    }
    res.send(postprocessing(generator({ data: obj, template })))
  } catch (e) {
    return res.status(500).send(e.message)
  } finally {
    await browser.close()
  }
})
app.listen(PORT, () => console.log(`Server Up & Running ${PORT}`))
