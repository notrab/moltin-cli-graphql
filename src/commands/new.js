const prompts = require('prompts')
const { cyan } = require('chalk')
const debug = require('debug')('moltin')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { success, error } = require('../utils/log')

const mutation = `mutation createStore($name: String!) {
  createStore(name: $name) {
    id: noneUuid
    name
  }
}`

const switchMutation = `mutation switchStore($activeStoreId: ID!) {
  switchStore(id: $activeStoreId) {
    success
  }
}`

module.exports = async options => {
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
        `You are about to create a new store ${cyan(
          values.name
        )} - Are you sure?`,
      initial: true
    }
  ])

  if (!name) {
    error('You must provide a name')
    process.exit(1)
  }

  if (!confirm) {
    error('Store creation aborted')
    process.exit(1)
  }

  debug('Running mutation to create store')
  const { createStore } = await moltin.request(mutation, { name })
  success(`${createStore.name} was created successfully.`)

  debug('Setting user config')
  await config.set({
    activeStoreId: createStore.id,
    activeStoreName: createStore.name
  })

  const { switchStore } = await moltin.request(switchMutation, {
    activeStoreId: createStore.id
  })

  if (!switchStore.success) {
    error(
      `There was a problem setting your current store. Run ${cyan(
        'moltin switch'
      )} and selecting ${cyan(createStore.name)} to fix.`
    )
    process.exit(1)
  }

  info(`Switched to active store ${green(createStore.name)}.`)
}
