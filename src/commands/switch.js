const prompts = require('prompts')
const { cyan } = require('chalk')
const debug = require('debug')('moltin')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { success, error } = require('../utils/log')

const query = `query getStores {
  stores {
    id
    noneUuid
    name
  }
}
`

const mutation = `mutation switchStore($activeStoreId: ID!) {
  switchStore(id: $activeStoreId) {
    success
  }
}`

module.exports = async options => {
  prompts.inject(options)

  debug('Getting all stores for prompt')
  const { stores } = await moltin.request(query)

  const { id: activeStoreId } = await prompts({
    type: 'select',
    name: 'id',
    message: 'Switch to:',
    choices: stores.map(({ noneUuid: value, name: title }) => ({
      title,
      value
    })),
    initial: 0
  })

  if (!activeStoreId) {
    error('You must select a valid store to switch')
    process.exit(1)
  }

  const { switchStore } = await moltin.request(mutation, { activeStoreId })

  if (!switchStore.success) {
    error('Unable to switch')
    process.exit(1)
  }

  const [{ name: activeStoreName }] = stores.filter(
    s => s.noneUuid === activeStoreId
  )

  await config.set({
    activeStoreId,
    activeStoreName
  })

  success(`Switched to ${cyan(activeStoreName)}!`)
}
