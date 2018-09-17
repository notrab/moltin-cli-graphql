import Table from 'cli-table'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'

const query = `query {
  stores {
    id: noneUuid
    name
  }
}`

export default async options => {
  debug(`Fetching all stores`)
  const { stores } = await moltin.request(query)

  debug('Creating table')
  const table = new Table({
    head: ['Store ID', 'Store Name'],
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
  })

  debug('Pushing row to table')
  stores.map(({ id, name }) => table.push({ [id]: name }))

  debug('Print table')
  console.log(table.toString())
  process.exit(0)
}
