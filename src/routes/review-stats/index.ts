'use strict'

import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { getReviewStatsHandler } from './handler'
import { GetReviewStatsSchema } from './schema'

export default async function reviewStatsRoutes (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  fastify.route({
    method: 'GET',
    url: '/', // The URL will be prefixed with '/review-stats' by autoload
    schema: GetReviewStatsSchema,
    handler: getReviewStatsHandler.bind(fastify) // Bind fastify instance to handler
  })
}
