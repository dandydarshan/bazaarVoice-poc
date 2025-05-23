'use strict'

const PRODUCT_ID_FILTER = 'productid:data-gen-2s9kaf0ugzn0p2flzl73ahuys,data-gen-td50ixwh9pmjispxbwtely59d,data-gen-3jxhm78sfqfy8tg5qyinqioal,data-gen-ov7cr69sakbegasbhejikf0q0'
const STATS_REVIEWS = 'Reviews'

module.exports = async function (fastify, opts) {
  fastify.get('/review-stats', async function (request, reply) {
    try {
      const filters = [PRODUCT_ID_FILTER]
      const stats = [STATS_REVIEWS]
      const reviewStats = await fastify.getReviewStats(filters, stats)
      return reviewStats
    } catch (err) {
      request.log.error(err, 'Error fetching review statistics for route /review-stats')
      throw fastify.httpErrors.internalServerError('Failed to fetch review statistics')
    }
  })
}
