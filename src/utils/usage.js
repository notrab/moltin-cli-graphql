const { cyan, bold, dim } = require('chalk')

exports.usage = `
${cyan(bold('Usage:'))} moltin COMMAND ${dim('[options]')}

${cyan(bold('Commands:'))}
  info                ${dim('Display information about the current store')}
  switch              ${dim('Switch between your available stores')}

  new                 ${dim('Create a new Moltin store')}
  stores | ls         ${dim('List all of your available stores')}
  rename              ${dim('Rename your current store')}
  keys                ${dim('Get your current store API keys')}
  get-token           ${dim('Generate an implicit or client_credentials token')}
  invite              ${dim('Invite someone to manage your store')}
  gateways            ${dim('List your payment gateway settings')}

  login               ${dim('Login to your Moltin account')}
  register            ${dim('Register a new Moltin account')}
  dashboard           ${dim('Open the Moltin dashboard')}

See ${cyan('https://bit.ly/moltin-cli')} for documentation.
`
