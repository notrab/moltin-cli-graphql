import { green, red, gray } from 'chalk'
import { pointer, tick, cross } from 'figures'

export const error = msg => console.log(`${red(cross)} ${msg}`)

export const info = msg => console.log(`${gray(pointer)} ${msg}`)

export const success = msg => console.log(`${green(tick)} ${msg}`)
