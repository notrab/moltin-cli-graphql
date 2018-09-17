const prompts = require('prompts')
const { cyan } = require('chalk')

const moltin = require('../utils/moltin')
const config = require('../utils/config')
const { success, info, error } = require('../utils/log')

const mutation = `mutation register($name: String!, $email: String!, $password: String!, $company: String) {
  register(name: $name, email: $email, password: $password, company: $company) {
    accessToken: access_token
    refreshToken: refresh_token
    user {
      name
      email
    }
  }
}`

module.exports = async options => {
  prompts.inject(options)

  const { name, email, password, confirm } = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Name'
    },
    {
      type: 'text',
      name: 'email',
      message: 'Email'
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password'
    },
    {
      type: 'confirm',
      name: 'confirm',
      message: (prev, values) =>
        `You are about to signup to Moltin as ${cyan(
          values.name
        )} using the email ${cyan(values.email)} - Are you sure?`,
      initial: true
    }
  ])

  if (!name || !email || !password) {
    error('You must provide a name, email AND password to register')
    process.exit(1)
  }

  if (!confirm) {
    error('Registration cancelled 😢')
    process.exit(1)
  }

  debug('Running mutation to register user')
  const {
    register: { accessToken, refreshToken, user }
  } = await moltin.request(mutation, { name, email, password })

  debug('Setting user config')
  await config.set({
    accessToken,
    refreshToken,
    email
  })

  success(`Welcome to Moltin ${cyan(user.name)}!`)
  info(`Run ${cyan('moltin new')} to create your first store.`)
}
