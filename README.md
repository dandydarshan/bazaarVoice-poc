# Bazaarvoice API Fastify Project

This project is a Fastify application that integrates with the Bazaarvoice API to fetch review statistics.

## Installation

To install the project dependencies, run the following command:

```bash
npm install
```

## Running the Project

To start the Fastify server, run the following command:

```bash
npm start
```

The server will typically start on `http://localhost:3000`.

## Available Endpoints

### GET /review-stats

This endpoint fetches review statistics from the Bazaarvoice API.

**Request:**

```
GET /review-stats
```

**Response:**

The endpoint returns a JSON response containing the review statistics.

**Example:**

```json
{
  "Results": [
    {
      "ProductStatistics": {
        "ReviewStatistics": {
          "AverageOverallRating": 4.5,
          "TotalReviewCount": 100
        }
      }
    }
  ],
  "HasErrors": false
}
```
