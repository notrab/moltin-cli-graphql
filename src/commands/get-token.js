const prompts = require('prompts')
const Table = require('cli-table')
const debug = require('debug')('moltin')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { error, info } = require('../utils/log')

const query = `query getKeys($storeId: ID!) {
  keys(storeId: $storeId) {
    client_id
    client_secret
  }
}`

const mutation = `mutation getToken($client_id: String!, $client_secret: String, $grant_type: GRANT_TYPE) {
  createToken(client_id: $client_id, client_secret: $client_secret, grant_type: $grant_type) {
    identifier
    access_token
    expires
    expires_in
  }
}`

module.exports = async options => {
  prompts.inject(options)

  const storeId = options.id || (await config.get('activeStoreId'))

  if (!storeId) {
    error('No store ID specified')
  }

  debug(`Fetching all API keys for store ${storeId}`)
  const {
    keys: [{ client_id, client_secret }]
  } = await moltin.request(query, { storeId })

  if (!client_id || !client_secret) {
    error('Unable to get your API keys')
    process.exit(0)
  }

  const grant_types = ['implicit', 'client_credentials']

  const { grant_type } = await prompts([
    {
      type: 'select',
      name: 'grant_type',
      message: 'Grant type:',
      initial: 0,
      choices: grant_types.map(t => ({ title: t, value: t }))
    }
  ])

  if (!grant_type || !grant_types.includes(grant_type)) {
    error('You must specify a valid grant_type')
    grant_type && info(`${grant_type} is not a valid grant_type`)
    process.exit(0)
  }

  const { createToken } = await moltin.request(mutation, {
    grant_type,
    client_id,
    ...(grant_type === 'client_credentials' && { client_secret })
  })

  if (!createToken) {
    error(`Unable to obtain a ${grant_type} token.`)
    info('Please try again.')
  }

  const table = new Table()
  table.push(
    { grant_type: createToken.identifier },
    { access_token: createToken.access_token },
    { expires: createToken.expires },
    { expires_in: createToken.expires_in }
  )
  console.log(table.toString())
  process.exit(0)
}
