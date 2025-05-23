'use strict'

const fp = require('fastify-plugin')
const { request } = require('undici')

const BAZAARVOICE_API_URL = 'https://stg.api.bazaarvoice.com/data/statistics.json'
const API_VERSION = '5.4'
const PASSKEY = 'caB45h2jBqXFw1OE043qoMBD1gJC8EwFNCjktzgwncXY4'

async function bazaarvoicePlugin (fastify, opts) {
  fastify.decorate('getReviewStats', async function (filters, stats) {
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
      } = await request(url)

      if (statusCode !== 200) {
        throw new Error(`Bazaarvoice API request failed with status code ${statusCode}`)
      }
      return body.json()
    } catch (err) {
      fastify.log.error(err, 'Error fetching review statistics from Bazaarvoice API')
      throw err
    }
  })
}

module.exports = fp(bazaarvoicePlugin, {
  name: 'bazaarvoice'
})
