import Table from 'cli-table'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'
import config from '../utils/config'
import { error } from '../utils/log'
import { getStoreById as getStoreByIdQuery } from '../queries'

export default async options => {
  const storeId = options.id || (await config.get('activeStoreId'))

  if (!storeId) {
    error('No store ID specified')
  }

  debug(`Fetching data for store with ID ${storeId}`)
  const { store } = await moltin.request(getStoreByIdQuery, { storeId })

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
