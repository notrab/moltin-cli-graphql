import Table from 'cli-table'
import { tick, cross } from 'figures'
import { green, red } from 'chalk'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'
import { getGateways as getGatewaysQuery } from '../queries'

export default async options => {
  debug(`Fetching all gateways`)
  const { gateways } = await moltin.request(getGatewaysQuery)

  debug('Creating table')
  const table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
  })

  debug('Pushing row to table')
  gateways.map(({ name, enabled }) =>
    table.push({ [name]: enabled ? green(tick) : red(cross) })
  )

  debug('Print table')
  console.log(table.toString())
  process.exit(0)
}
