import { Type } from '@sinclair/typebox'

// Define a basic response schema for the Bazaarvoice API response
export const BazaarvoiceResponseSchema = Type.Object({
  Results: Type.Array(Type.Any()),
  HasErrors: Type.Boolean()
  // Add other fields if known and necessary
})

// You can also define request schemas (e.g., for query parameters or body) if needed
// export const GetReviewStatsRequestSchema = Type.Object({ ... })

export const GetReviewStatsSchema = {
  response: {
    200: BazaarvoiceResponseSchema
    // Define other response codes if necessary
  }
  // Add querystring, params, body schemas if needed
  // querystring: GetReviewStatsRequestSchema
}
