import prompts from 'prompts'
import { cyan } from 'chalk'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'
import config from '../utils/config'
import { success, error } from '../utils/log'
import {
  createStore as createStoreMutation,
  switchStore as switchStoreMutation
} from '../mutations'

export default async options => {
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
      message: (_, values) =>
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
  const { createStore } = await moltin.request(createStoreMutation, { name })
  success(`${createStore.name} was created successfully.`)

  debug('Setting user config')
  await config.set({
    activeStoreId: createStore.id,
    activeStoreName: createStore.name
  })

  const { switchStore } = await moltin.request(switchStoreMutation, {
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
