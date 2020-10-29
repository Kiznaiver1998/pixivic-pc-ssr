const fs = require('fs')
const path = require('path')
const logger = require('./logger')

const loadEnvs = (mode, dotenvPath) => {
  const dotenvFiles = [
    `${dotenvPath}.${mode}.local`,
    `${dotenvPath}.${mode}`,
    // Don't include `.env.local` for `test` mode
    // since normally you expect tests to produce the same
    // results for everyone
    mode !== 'test' && `${dotenvPath}.local`,
    dotenvPath
  ].filter(Boolean)

  dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
      logger.debug('Using env file:', dotenvFile)
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile
        })
      )
    }
  })
}

loadEnvs(process.env.NODE_ENV || 'development', path.resolve(process.cwd(), '.env'))

const envKeys = Object.keys(process.env).filter(key => /^VUE_APP_/.test(key))

const stringifiedEnvs = envKeys.reduce((res, name) => {
  res[`process.env.${name}`] = JSON.stringify(process.env[name])
  return res
}, {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
})

if (process.env.NODE_ENV !== 'production') {
  logger.debug('Using env', stringifiedEnvs)
}

module.exports = stringifiedEnvs
