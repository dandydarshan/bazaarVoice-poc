'use strict'

import fp from 'fastify-plugin'
import { request, Dispatcher } from 'undici' // Import Dispatcher for type safety
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

const BAZAARVOICE_API_URL = 'https://stg.api.bazaarvoice.com/data/statistics.json'
const API_VERSION = '5.4'
// TODO: Externalize the passkey to an environment variable for better security
const PASSKEY = 'caB45h2jBqXFw1OE043qoMBD1gJC8EwFNCjktzgwncXY4'

interface BazaarvoiceClientOptions extends FastifyPluginOptions {
  // Define any options for your plugin here
}

// Define a type for the stats parameter
type StatsType = string[];

// Define a type for the filters parameter
type FiltersType = string[];

async function bazaarvoiceClientPlugin(fastify: FastifyInstance, opts: BazaarvoiceClientOptions) {
  const fetchStats = async function (filters: FiltersType, stats: StatsType): Promise<Record<string, any>> {
    const queryParams = new URLSearchParams({
      apiversion: API_VERSION,
      passkey: PASSKEY,
      stats: stats.join(','),
    })

    if (filters && filters.length > 0) {
      queryParams.append('filter', filters.join(','))
    }

    const url = `${BAZAARVOICE_API_URL}?${queryParams.toString()}`

    try {
      const {
        body,
        statusCode
      }: { body: Dispatcher.ResponseData['body'], statusCode: number } = await request(url) // Add types for response

      if (statusCode !== 200) {
        throw new Error(`Bazaarvoice API request failed with status code ${statusCode}`)
      }
      return await body.json() as Record<string, any>
    } catch (err) {
      // It's better to let the caller handle logging if it's more context-specific
      // fastify.log.error(err, 'Error fetching review statistics from Bazaarvoice API')
      throw err
    }
  }

  if (!fastify.bazaarvoiceClient) {
    fastify.decorate('bazaarvoiceClient', { fetchStats })
  }
}

export default fp(bazaarvoiceClientPlugin, {
  name: 'bazaarvoice-client',
  // Optional: specify dependencies if this plugin depends on others
  // dependencies: ['other-plugin']
})
