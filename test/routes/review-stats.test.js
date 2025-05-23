'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('GET /review-stats returns 200 OK', async (t) => {
  const app = await build(t)

  // Mock the getReviewStats method
  app.decorate('getReviewStats', async (filters, stats) => {
    return {
      Results: [
        {
          ProductStatistics: {
            ReviewStatistics: {
              AverageOverallRating: 4.5,
              TotalReviewCount: 100
            }
          }
        }
      ],
      HasErrors: false
    }
  })

  const res = await app.inject({
    method: 'GET',
    url: '/review-stats'
  })

  t.equal(res.statusCode, 200, 'returns a status code of 200')
})
