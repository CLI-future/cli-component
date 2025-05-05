import { Command } from 'commander'
import open from 'open'

import { checkConfigFileAvailability } from '../../utils/file-manager.js'
import { ErrorMessages } from '../../utils/messages/error.js'
import { error, log } from '../../utils/command-helpers.js'
import { CliAPI, type CliOptions } from './types.js'
import { createSessionId } from './service.js'
import { writeFileSync } from 'fs'

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
      const {isAvailable,path,config} = checkConfigFileAvailability()

      if (!isAvailable) return

      const webUI = process.env.CLI_WEB_UI || 'http://localhost:3000'
      log(`Logging in to your CLI account...`)

      // Create session id for auth
      const { data, message, code } = await this.cli.api.createSessionId()

      if (code !== 200) {
        error(message)
        return
      }

      //Open browser for authentication
      const authLink = `${webUI}/auth/login?sessionId=${data}`

      await open(authLink)

      log(`Opening ${authLink}`)

      const newConfig = {
        ...config,
        clientConfig: {
          ...config?.clientConfig,
          sessionId: data,
        }
      }
      writeFileSync(path, JSON.stringify(newConfig, null, 2))

    } catch (err) {
      error(ErrorMessages.AUTHENTICATION_FAILED, err)
    }
  }
}
