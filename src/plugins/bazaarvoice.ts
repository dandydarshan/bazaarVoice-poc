'use strict'

import fp from 'fastify-plugin'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

// Define a type for the stats parameter
type StatsType = string[];

// Define a type for the filters parameter
type FiltersType = string[];

// Define the expected structure for the decorated bazaarvoiceClient
interface BazaarvoiceClient {
  fetchStats: (filters: FiltersType, stats: StatsType) => Promise<Record<string, any>>;
}

// Extend FastifyInstance to include the bazaarvoiceClient decoration
declare module 'fastify' {
  interface FastifyInstance {
    bazaarvoiceClient: BazaarvoiceClient;
    getReviewStats: (filters: FiltersType, stats: StatsType) => Promise<Record<string, any>>;
  }
}

async function bazaarvoicePlugin(fastify: FastifyInstance, opts: FastifyPluginOptions) {
  // This plugin now relies on bazaarvoiceClient being registered
  if (!fastify.bazaarvoiceClient) {
    throw new Error('bazaarvoice-client plugin must be registered before bazaarvoice plugin')
  }

  fastify.decorate('getReviewStats', async function (filters: FiltersType, stats: StatsType): Promise<Record<string, any>> {
    try {
      // Use the new bazaarvoiceClient to fetch stats
      return await fastify.bazaarvoiceClient.fetchStats(filters, stats)
    } catch (err) {
      // Log the error using Fastify's logger
      fastify.log.error(err, 'Error fetching review statistics via bazaarvoiceClient')
      // Re-throw the error to be handled by the caller or a generic error handler
      throw err
    }
  })
}

export default fp(bazaarvoicePlugin, {
  name: 'bazaarvoice',
  dependencies: ['bazaarvoice-client'] // Declare dependency
})
