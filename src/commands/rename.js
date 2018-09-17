import prompts from 'prompts'
import { cyan } from 'chalk'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'
import config from '../utils/config'
import { success, error } from '../utils/log'
import { renameStore } from '../mutations'

export default async options => {
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

  debug('Running renameStore mutation to update store')
  const { updateStore } = await moltin.request(renameStore, { storeId, name })

  debug('Setting user config')
  await config.set({
    activeStoreName: updateStore.name
  })

  success(`Store renamed to ${cyan(name)}`)
}
