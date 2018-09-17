const Table = require('cli-table')
const debug = require('debug')('moltin')
const { tick, cross } = require('figures')
const { green, red } = require('chalk')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { error } = require('../utils/log')

const query = `query getGateways {
  gateways {
    ... on Stripe {
      name
      enabled
    }
    ... on Braintree {
      name
      enabled
    }
    ... on CardConnect {
      name
      enabled
    }
    ... on Adyen {
      name
      enabled
    }
    ... on Manual {
      name
      enabled
    }
  }
}`

module.exports = async options => {
  debug(`Fetching all gateways`)
  const { gateways } = await moltin.request(query)

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
