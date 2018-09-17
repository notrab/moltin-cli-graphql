const { green, red, gray } = require('chalk')
const { pointer, tick, cross } = require('figures')

module.exports.info = msg => console.log(`${gray(pointer)} ${msg}`)

module.exports.success = msg => console.log(`${green(tick)} ${msg}`)

module.exports.error = msg => console.log(`${red(cross)} ${msg}`)
