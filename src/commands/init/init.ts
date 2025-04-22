import { writeFileSync, existsSync, readFileSync } from 'fs'
import { access, writeFile, appendFile } from 'fs/promises'
import { dirname, join } from 'path'
import inquirer from 'inquirer'
import chalk from 'chalk'

import { CONFIG_FILE, error, log, logObject, warning } from '../../utils/command-helpers.js'
import { findProjectRoot } from '../../utils/file-manager.js'
import { generateClientId } from '../../utils/crypto.js'

// Function to load the configuration file if it exists
const loadConfiguration = (configPath: string) => {
  if (existsSync(configPath)) {
    const configContent = readFileSync(configPath, 'utf8')
    return JSON.parse(configContent)
  }
  return null
}

const ensureGitignore = async (rootDirectory: string) => {
  try {
    const gitignorePath = join(dirname(rootDirectory), '.gitignore')
    const fileExists = await access(gitignorePath)
      .then(() => true)
      .catch(() => false)

    const message = fileExists
      ? 'Do you want to include the config file in the existing .gitignore file?'
      : 'The .gitignore file does not exist. Do you want to create it and include the config file?'

    const { includeGitignore } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'includeGitignore',
        message,
        default: true,
      },
    ])

    if (includeGitignore) {
      if (!fileExists) {
        await writeFile(gitignorePath, `\n${CONFIG_FILE}`, 'utf8')
      } else {
        const gitignoreContent = readFileSync(gitignorePath, 'utf8')
        if (!gitignoreContent.includes(CONFIG_FILE)) {
          await appendFile(gitignorePath, `\n${CONFIG_FILE}`, 'utf8')
        }
      }
    }
  } catch (err: unknown) {
    error(`Error occurred while handling .gitignore:`, err)
  }
}

const askPreferences = async (configPath: string) => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Which language would you like to use?',
      choices: [
        { name: 'JavaScript', value: 'javascript' },
        { name: 'TypeScript', value: 'typescript' },
      ],
      default: 'javaScript',
    },
    {
      type: 'list',
      name: 'styling',
      message: 'Which styling approach should components use by default?',
      choices: [
        { name: 'Plain CSS', value: 'plain-css' },
        { name: 'CSS Modules', value: 'css-modules' },
        { name: 'Styled Components', value: 'styled-components' },
        { name: 'Tailwind CSS', value: 'tailwind-css' },
      ],
      default: 'CSS',
    },
    {
      type: 'confirm',
      name: 'includeTests',
      message: 'Should components include test files',
      default: true,
    },
    {
      type: 'list',
      name: 'testLibrary',
      message: 'Which testing framework should be used?',
      when: (answers) => answers.includeTests,
      choices: [
        { name: 'Jest', value: 'jest' },
        { name: 'React Testing Library', value: 'react-testing-library' },
        { name: 'Cypress', value: 'cypress' },
      ],
      default: 'jest',
    },
  ])

  // Save preferences to the config file
  const details = {
    technicalConfig: {
      styling: answers.styling,
      language: answers.language,
      testLibrary: answers.testLibrary,
    },
    clientConfig : {
      clientId: generateClientId(),
    }
  }

  await ensureGitignore(configPath)

  writeFileSync(configPath, JSON.stringify(details, null, 2))
  console.log(
    chalk.green.bold(`
========================================================================
✔ Success!
Your configuration has been saved to: ${chalk.cyan.underline(configPath)}
========================================================================
`),
  )
}

export const initConfig = async () => {
  const rootDirectory: string | null = findProjectRoot(['package.json', '.git'])

  if (!rootDirectory) {
    error("The root directory fo the project wasn't found")
    return
  }

  const configPath = join(rootDirectory, CONFIG_FILE)

  const existingConfig = loadConfiguration(configPath)

  try {
    if (existingConfig) {
      warning('Configuration already exists:')
      logObject(existingConfig)

      const { updateConfig } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'updateConfig',
          message: 'Do you want to update the existing configuration?',
          default: false,
        },
      ])

      if (!updateConfig) {
        log('Using the existing configuration.')
        return
      } else {
        log('Starting the configuration process...')
      }
    }

    await askPreferences(configPath)
  } catch (err: unknown) {
    error('Error saving configuration:', err)
  }
}
