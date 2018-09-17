import prompts from 'prompts'
import { cyan, green } from 'chalk'

import debug from '../utils/debugger'
import moltin from '../utils/moltin'
import config from '../utils/config'
import { success, info, error } from '../utils/log'

import {
  login as loginMutation,
  switchStore as switchMutation
} from '../mutations'
import { getStores as getStoresQuery } from '../queries'

export default async options => {
  prompts.inject(options)

  const { email, password } = await prompts([
    {
      type: 'text',
      name: 'email',
      message: 'Email/Username'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password'
    }
  ])

  if (!email || !password) {
    error('You must provide an email/username AND password to login')
    process.exit(1)
  }

  debug('Authenticating with the CLI API')
  const {
    login: { accessToken, refreshToken, user }
  } = await moltin.request(loginMutation, { email, password })

  debug('Setting config')
  await config.set({
    accessToken,
    refreshToken,
    email: user.email
  })

  let activeStoreId = await config.get('activeStoreId')
  let activeStoreName = await config.get('activeStoreName')

  if (!activeStoreId && !activeStoreName) {
    debug('Getting all stores')
    const {
      stores: [{ noneUuid, name }]
    } = await moltin.request(getStoresQuery)

    activeStoreId = noneUuid
    activeStoreName = name

    debug('Setting active store ID')
    await config.set({
      activeStoreId,
      activeStoreName
    })
  }

  const { switchStore } = await moltin.request(switchMutation, {
    activeStoreId
  })

  if (!switchStore.success) {
    error(
      `There was a problem setting your current store. Run ${cyan(
        'moltin switch'
      )} to fix.`
    )
    process.exit(1)
  }

  success(`You are authenticated as ${cyan(user.name)}!`)
  info(`Current active store ${green(activeStoreName)}.`)
  info(`Run ${cyan('moltin switch')} to change.`)
}
