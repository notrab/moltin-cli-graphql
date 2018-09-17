import prompts from 'prompts'
import { cyan } from 'chalk'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'
import config from '../utils/config'
import { success, error } from '../utils/log'
import { getStores as getStoresQuery } from '../queries'
import { switchStore as switchStoreMutation } from '../mutations'

export default async options => {
  prompts.inject(options)

  debug('Getting all stores for prompt')
  const { stores } = await moltin.request(getStoresQuery)

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

  const { switchStore } = await moltin.request(switchStoreMutation, {
    activeStoreId
  })

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
