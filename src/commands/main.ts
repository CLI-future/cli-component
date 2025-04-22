import { log, USER_AGENT } from '../utils/command-helpers.js'
import { getPackageJson } from '../utils/file-manager.js'

import { createComponentGenerateCommand } from './generate/index.js'
import { createInitCommand } from './init/index.js'
import { createLoginCommand } from './login/index.js'

import BaseCommand from './base-commaned/index.js'

const mainCommand = async () => {
  const { name, version } = await getPackageJson()
  log(USER_AGENT(name, version))
}

export const createMainCommand = async () => {
  const program = new BaseCommand()

  createInitCommand(program)
  createLoginCommand(program)
  createComponentGenerateCommand(program)

  program.option('-v, --version', 'output the current version').showSuggestionAfterError(true).action(mainCommand)

  await program.parseAsync(process.argv)

  return program
}
