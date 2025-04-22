import { Command } from 'commander'
import open from 'open'

import { error, log } from '../../utils/command-helpers.js'
import { ErrorMessages } from '../../utils/messages/error.js'
import { createSessionId } from './service.js'

import { CliAPI, type CliOptions } from './types.js'

export default class BaseCommand extends Command {
  cli!: CliOptions

  constructor() {
    super()
    this.cli = {
      api: this.initializeApi(),
    }
  }

  private initializeApi(): CliAPI {
    return {
      createSessionId: () => createSessionId(),
    }
  }

  async expensivelyAuthenticate() {
    try {
      const webUI = process.env.CLI_WEB_UI || 'http://localhost:3000'
      log(`Logging in to your CLI account...`)

      // Create session id for auth
      const { data, message, code } = await this.cli.api.createSessionId()

      if (code !== 200) {
        error(message)
        return
      }

      //Open browser for authentication
      const authLink = `${webUI}/auth?sessionId=${data}`

      await open(authLink)

      log(`Opening ${authLink}`)
    } catch (err) {
      error(ErrorMessages.AUTHENTICATION_FAILED, err)
    }
  }
}
