'use strict'

import path from 'node:path'
import Fastify, { FastifyInstance } from 'fastify'
import App from '../src/app' // Updated path to src/app.ts
import { TPTap } from 'tap' // Import tap type for 't' parameter

// Fill in this config with all the configurations
// needed for testing the application
async function config () {
  return {}
}

// Automatically build and tear down our instance
async function build (t: TPTap) { // Added type for t
  const app: FastifyInstance = Fastify()

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  // Corrected registration: App is a default export
  await app.register(App, await config())

  // tear down our app instance after we are done
  t.teardown(app.close.bind(app))

  return app
}

export {
  config,
  build
}
