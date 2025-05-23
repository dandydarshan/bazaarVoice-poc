'use strict'

import { test } from 'tap'
import { build } from '../helper'
import { FastifyInstance } from 'fastify'
// Import the schema to create a compatible mock response
import { BazaarvoiceResponseSchema } from '../../src/routes/review-stats/schema'
import { Static } from '@sinclair/typebox'

// Define the type for our mock response based on the schema
type MockResponseType = Static<typeof BazaarvoiceResponseSchema>;

test('GET /review-stats returns 200 OK and valid payload', async (t) => {
  const app: FastifyInstance = await build(t)

  // Define a mock response that is compatible with BazaarvoiceResponseSchema
  const mockResponse: MockResponseType = {
    Results: [
      {
        ProductStatistics: {
          ReviewStatistics: {
            AverageOverallRating: 4.75,
            TotalReviewCount: 120,
            // Add any other fields that are part of your actual schema/data if necessary
          }
        },
        // Add other product statistics or elements if your schema expects them
      }
    ],
    HasErrors: false
    // Add other top-level fields from the schema if necessary
  }

  // Mock the getReviewStats method
  // This method is decorated onto the Fastify instance by the bazaarvoice plugin
  app.decorate('getReviewStats', async (filters: string[], stats: string[]) => {
    // Optionally, you can add assertions here to check if filters and stats are as expected
    // t.same(filters, ['expectedFilter']);
    // t.same(stats, ['expectedStat']);
    return mockResponse
  })

  const res = await app.inject({
    method: 'GET',
    url: '/review-stats' // This will be routed to src/routes/review-stats/index.ts
  })

  t.equal(res.statusCode, 200, 'returns a status code of 200')
  
  // Parse the JSON response payload
  const payload = JSON.parse(res.payload)
  
  // Check if the response payload matches the mocked data
  // t.same(payload, mockResponse, 'response payload matches mocked data')
  // For more robust checking against schema, you might compare specific fields
  // or use a JSON schema validator if needed, but for this case, direct comparison is fine.
  t.equal(payload.HasErrors, mockResponse.HasErrors, 'HasErrors matches')
  t.ok(payload.Results && payload.Results.length > 0, 'Results array is present and not empty')
  if (payload.Results && payload.Results.length > 0 && mockResponse.Results && mockResponse.Results.length > 0) {
    const firstResultPayload = payload.Results[0].ProductStatistics.ReviewStatistics;
    const firstResultMock = (mockResponse.Results[0] as any).ProductStatistics.ReviewStatistics; // Cast to any if structure is complex
    t.equal(firstResultPayload.AverageOverallRating, firstResultMock.AverageOverallRating, 'AverageOverallRating matches');
    t.equal(firstResultPayload.TotalReviewCount, firstResultMock.TotalReviewCount, 'TotalReviewCount matches');
  }
})
