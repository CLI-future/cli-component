import BaseCommand from '../base-commaned/index.js'


export const login = async (command: BaseCommand) => {
  await command.expensivelyAuthenticate()
}