const Table = require('cli-table')
const debug = require('debug')('moltin')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { info, error } = require('../utils/log')

const query = `query getKeys($storeId: ID!) {
  keys(storeId: $storeId) {
    client_id
    client_secret
  }
}`

module.exports = async options => {
  const storeId = options.id || (await config.get('activeStoreId'))

  if (!storeId) {
    error('No store ID specified')
  }

  debug(`Fetching all API keys for store ${storeId}`)
  const { keys } = await moltin.request(query, { storeId })

  debug('Creating table')
  const table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
  })

  debug('Pushing row to table')
  keys.map(({ client_id, client_secret }) =>
    table.push({ client_id }, { client_secret })
  )

  debug('Print table')
  console.log(table.toString())
  process.exit(0)
}
