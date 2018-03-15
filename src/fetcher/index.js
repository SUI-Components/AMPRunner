const fs = require('fs')
const path = require('path')
const request = require('request-promise-native')

const IDENTITY_FUNCTION = 'module.exports = html => html'
const isFetchLocal = !!process.env.FETCH_LOCAL
const __CACHE__ = {}

isFetchLocal &&
  console.log(`
Fetching packages locally from ${process.cwd()}/node_modules
`)

const fetchORIdentity = async url => {
  let postprocessing
  try {
    postprocessing = await request(url)
  } catch (e) {
    postprocessing = IDENTITY_FUNCTION
  }
  return postprocessing
}

const readORIdentity = path => {
  let content = IDENTITY_FUNCTION
  try {
    content = fs.readFileSync(path, {
      encoding: 'utf8'
    })
    return content
  } catch (e) {
    return content
  }
}

module.exports = async ({ org, pkg, ver = 'latest' }) => {
  const CDN_HOST = 'https://unpkg.com/'
  const key = `${org}#${pkg}#${ver}`
  const cdn = [CDN_HOST, org && `@${org}`, `/${pkg}`, ver && `@${ver}`]
    .filter(Boolean)
    .join('')

  if (__CACHE__[key]) {
    return __CACHE__[key]
  }

  if (isFetchLocal) {
    const localModulePath = path.join(
      process.cwd(),
      'node_modules',
      cdn.replace(CDN_HOST, '').replace(`@${ver}`, '')
    )
    const files = [
      fs.readFileSync(path.join(localModulePath, 'queries.js'), {
        encoding: 'utf8'
      }),
      fs.readFileSync(path.join(localModulePath, 'index.tpl'), {
        encoding: 'utf8'
      }),
      readORIdentity(path.join(localModulePath, 'postprocessing.js'))
    ]
    __CACHE__[key] = files
    return files
  }

  const [qs, template] = await Promise.all([
    request(`${cdn}/queries.js`),
    request(`${cdn}/index.tpl`)
  ])

  const postprocessing = await fetchORIdentity(`${cdn}/postprocessing.js`)

  __CACHE__[key] = [qs, template, postprocessing]
  return __CACHE__[key]
}
