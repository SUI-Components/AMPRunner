const puppeteer = require('puppeteer')
const rimraf = require('rimraf')
const getChromePath = require('@browserless/aws-lambda-chrome')({
  path: '/tmp'
})

const isLambda = !!process.env.LAMBDA_TASK_ROOT
const getExecutablePath = async () => (isLambda ? getChromePath() : undefined)

module.exports = {
  cleanProfileFolder: browser => {
    if (!browser) {
      return
    }
    const chromeSpawnArgs = browser.process().spawnargs
    const [, pathProfile] = chromeSpawnArgs
      .find(flag => flag.includes('--user-data-dir'))
      .split('=')
    rimraf.sync(pathProfile)
    console.log('Delete profile folder:', pathProfile)
  },
  initBrowser: async () =>
    puppeteer.launch({
      headless: isLambda,
      executablePath: await getExecutablePath(),
      ignoreHTTPSErrors: true,
      args: [
        '--disable-gpu',
        '--single-process', // Currently wont work without this :-(
        isLambda ? '--no-zygote' : undefined, // helps avoid zombies
        '--no-sandbox',
        '--hide-scrollbars'
      ].filter(Boolean)
    })
}
