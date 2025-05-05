import os from 'os'
import WSL from 'is-wsl'

import chalk from 'chalk'

const platform = WSL ? 'wsl' : os.platform()
const arch = os.arch() === 'ia32' ? 'x86' : os.arch()

export const USER_AGENT = (name: string, version: string) =>
  `${name}/${version} ${platform}-${arch} node-${process.version}`

export const CONFIG_FILE = 'cli-components.config.json'

export const log = (message: string) => {
  console.log(chalk.green(message))
}

export const error = (message: string, error?: unknown) => {
  if (!error) {
    console.error(chalk.red(message))
  }

  if (error instanceof Error) {
    console.error(chalk.red(message), error.message)
  } else {
    console.error(chalk.red('An unknown error occurred.'))
  }
}

export const warning = (message: string) => {
  console.log(chalk.yellow(message))
}

export const logObject = (obj: object): void => {
  console.log(JSON.stringify(obj, null, 2).replace(/(".*?")/g, chalk.green(`$1`)))
}
