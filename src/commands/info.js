const Table = require('cli-table')
const debug = require('debug')('moltin')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { error } = require('../utils/log')

const query = `query getStore($storeId: ID!) {
  store(id: $storeId) {
    id: noneUuid
    name
    users {
      name
    }
  }
}`

module.exports = async options => {
  const storeId = options.id || (await config.get('activeStoreId'))

  if (!storeId) {
    error('No store ID specified')
  }

  debug(`Fetching data for store with ID ${storeId}`)
  const { store } = await moltin.request(query, { storeId })

  debug('Creating table')
  const table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
  })

  debug('Pushing row to table')
  table.push(
    {
      ID: store.id
    },
    {
      Name: store.name
    },
    {
      Users: store.users.map(({ name }) => name).join(', ')
    }
  )

  debug('Print table')
  console.log(table.toString())
  process.exit(0)
}
