const prompts = require('prompts')
const { cyan } = require('chalk')
const debug = require('debug')('moltin')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { success, error } = require('../utils/log')

const mutation = `mutation rename($storeId: ID!, $name: String!) {
  updateStore(id: $storeId, name: $name) {
    name
  }
}`

module.exports = async options => {
  const storeId = options.id || (await config.get('activeStoreId'))

  if (!storeId) {
    error('No store ID specified')
  }

  prompts.inject(options)

  const { name, confirm } = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Name'
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (prev, values) =>
        `You are about to rename your store to ${cyan(
          values.name
        )} - Are you sure?`,
      initial: true
    }
  ])

  if (!name) {
    error('You must provide a new name')
    process.exit(1)
  }

  if (!confirm) {
    error('You must confirm the change')
    process.exit(1)
  }

  debug('Running mutation to update store')
  const { updateStore } = await moltin.request(mutation, { storeId, name })

  debug('Setting user config')
  await config.set({
    activeStoreName: updateStore.name
  })
}
