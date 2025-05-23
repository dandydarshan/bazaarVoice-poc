'use strict'

import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
// No need to import BazaarvoiceResponseSchema here for handler parameters directly,
// as Fastify handles schema validation based on what's attached in index.ts.
// However, the return type of the handler should match the response schema.
import { BazaarvoiceResponseSchema } from './schema'
import { Static } from '@sinclair/typebox'

// Type for the expected response, derived from the schema
type BazaarvoiceResponseType = Static<typeof BazaarvoiceResponseSchema>;

const PRODUCT_ID_FILTER = 'productid:data-gen-2s9kaf0ugzn0p2flzl73ahuys,data-gen-td50ixwh9pmjispxbwtely59d,data-gen-3jxhm78sfqfy8tg5qyinqioal,data-gen-ov7cr69sakbegasbhejikf0q0'
const STATS_REVIEWS = 'Reviews'

export async function getReviewStatsHandler (this: FastifyInstance, request: FastifyRequest, reply: FastifyReply): Promise<BazaarvoiceResponseType> {
  try {
    const filters = [PRODUCT_ID_FILTER]
    const stats = [STATS_REVIEWS]
    // 'this' refers to the FastifyInstance, which has getReviewStats decorated
    const reviewStats = await this.getReviewStats(filters, stats)
    return reviewStats as BazaarvoiceResponseType // Cast to ensure type conformity, though Fastify handles serialization
  } catch (err) {
    request.log.error(err, 'Error fetching review statistics for route /review-stats')
    // Use this.httpErrors for consistency if FastifyInstance is correctly 'this'
    throw this.httpErrors.internalServerError('Failed to fetch review statistics')
  }
}
