import { initConfig } from './init.js'
import BaseCommand from '../base-commaned/index.js'

export const createInitCommand = (program: BaseCommand) =>
  program
    .command('init')
    .description('Initialize CLI preferences (e.g., CSS or SCSS, JS or TS)')
    .action(initConfig)
