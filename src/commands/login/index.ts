import BaseCommand from '../base-commaned/index.js'

export const createLoginCommand = (program: BaseCommand) =>
  program
    .command('login')
    .description(
      `Login to your CLI account 
      Opens a web browser to acquire an OAuth token.`,
    )
    .action(async (command: BaseCommand) => {
      const {login} = await import('./login.js')
      await login(command)
    })