const puppeteer = require('puppeteer')
const getChromePath = require('@browserless/aws-lambda-chrome')({
  path: '/tmp'
})

const isLambda = !!process.env.LAMBDA_TASK_ROOT
const getExecutablePath = async () => (isLambda ? getChromePath() : undefined)

module.exports = async () =>
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
