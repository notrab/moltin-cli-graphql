#! /usr/bin/env node

import meow from 'meow'
import info from './commands/info'
import newStore from './commands/new'
import switchStore from './commands/switch'
import listStores from './commands/list'
import renameStore from './commands/rename'
import keys from './commands/keys'
import getToken from './commands/get-token'
import gateways from './commands/gateways'
import login from './commands/login'
import register from './commands/register'
import dashboard from './commands/dashboard'
import { usage } from './utils/usage'
import { info as infoLog } from './utils/log'

const options = {
  flags: { storeId: { alias: 'id' }, accessToken: { alias: 't' } }
}

const cli = meow(usage, options)

async function main(command, options) {
  switch (command) {
    case 'info':
      return info(options)

    case 'switch':
      return switchStore(options)

    case 'new':
      return newStore(options)

    case 'stores':
    case 'ls':
      return listStores(options)

    case 'rename':
      return renameStore(options)

    case 'keys':
      return keys(options)

    case 'get-token':
    case 'gt':
      return getToken('get-token')

    case 'invite':
      return console.log('invite')

    case 'gateways':
      return gateways(options)

    case 'login':
      return login(options)

    case 'register':
      return register(options)

    case 'dashboard':
      return dashboard(options)

    case undefined:
      return process.stdout.write(usage)

    default:
      return infoLog(`Unknown command: ${command}`)
  }
}

// process.on('unhandledRejection', e => {
//   console.log(e.stack)
//   process.exit(e.errno || 1)
// })

main(cli.input[0], cli.flags)
