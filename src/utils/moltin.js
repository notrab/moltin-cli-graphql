const { GraphQLClient } = require('graphql-request')

const config = require('./config')

const token = config.get('accessToken')

const CLI_API_URL = 'https://cli.moltin.com'

const client = new GraphQLClient(CLI_API_URL, {
  headers: {
    ...(token && { Authorization: `Bearer ${token}` })
  }
})

module.exports = client
