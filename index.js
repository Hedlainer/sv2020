const sls = require('serverless-http')
const nuxt = require('./nuxt')

module.exports.nuxt = sls(nuxt)
