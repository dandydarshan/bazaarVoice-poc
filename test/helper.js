'use strict'

const path = require('node:path')
const Fastify = require('fastify')
const App = require('../app.js') // Corrected path

// Fill in this config with all the configurations
// needed for testing the application
async function config () {
  return {}
}

// Automatically build and tear down our instance
async function build (t) {
  const app = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  await app.register(App, await config()) // Corrected registration

  // tear down our app instance after we are done
  t.teardown(app.close.bind(app))

  return app
}

module.exports = {
  config,
  build
}
