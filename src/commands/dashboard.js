import opn from 'opn'

import config from '../utils/config'

export default async () => {
  if (['win32', 'darwin'].includes(process.platform)) {
    const email = await config.get('email')
    const qs = email ? `?email=${email}` : ''

    console.log('Opening the moltin dashboard...')

    opn(`https://dashboard.moltin.com/login${qs}`, {
      wait: false
    })
  } else {
    console.log(`Visit https://dashboard.moltin.com in your browser.`)
  }
}
