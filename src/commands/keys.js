import Table from 'cli-table'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'
import config from '../utils/config'
import { error } from '../utils/log'
import { getKeys as getKeysQuery } from '../queries'

export default async options => {
  const storeId = options.id || (await config.get('activeStoreId'))

  if (!storeId) {
    error('No store ID specified')
  }

  debug(`Fetching all API keys for store ${storeId}`)
  const { keys } = await moltin.request(getKeysQuery, { storeId })

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
