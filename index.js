const app = require('fastify')()
const { Nuxt } = require('nuxt-start')
const sls = require('serverless-http')
const config = require('./nuxt.config.js')
const nuxt = new Nuxt({ ...config, dev: false })

app.use(nuxt.render)

const handler = sls(app)

module.exports.handler = async () => {
  await app.ready()
  await nuxt.ready()
  return handler()
}
