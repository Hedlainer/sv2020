const { Nuxt } = require('nuxt-start')

const fastify = require('fastify')
const config = require('./nuxt.config.js')

const app = fastify()

const nuxt = new Nuxt({ ...config, dev: false })

module.exports = async (req, res) => {
  await nuxt.ready()
  app.use(nuxt.render(req, res))
}
