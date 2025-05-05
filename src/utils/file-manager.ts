import fs, { existsSync, readFileSync } from 'fs'
import path, { dirname, join } from 'path'
import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'

import { CONFIG_FILE, error } from './command-helpers.js'
import { ConfigFileStatus, PackageJson } from './types.js'
import { ErrorMessages } from './messages/error.js'

// Ensure that directories exist before writing files
export const ensureDirectoryExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Write component files to the target directory
export const writeComponentFiles = (componentDir: string, componentName: string, componentCode: any, cssCode: any) => {
  ensureDirectoryExists(componentDir)

  // Write the JSX file dsfgndfg
  fs.writeFileSync(path.join(componentDir, `${componentName}.jsx`), componentCode.trim())

  if (cssCode) {
    // Write the CSS file (optional)
    fs.writeFileSync(path.join(componentDir, `${componentName}.css`), cssCode.trim())
  }
}

export const findProjectRoot = (markerFiles: string[]) => {
  // Start from the current working directory
  let currentDirectory = process.cwd()

  //Root of the file system
  const rootDirectory = path.parse(currentDirectory).root

  // Traverse up the directory tree until the root
  while (currentDirectory !== rootDirectory) {
    for (const file of markerFiles) {
      // Check if any of the marker files exists in the current directory
      if (existsSync(join(currentDirectory, file))) {
        return currentDirectory
      }
    }

    // Move up one directory
    currentDirectory = dirname(currentDirectory)
  }

  return null // Return null if root not found
}

export const getPackageJson = async (): Promise<PackageJson> => {
  const packageJsonPath = join(dirname(fileURLToPath(import.meta.url)), '../../package.json')

  return JSON.parse(await readFile(packageJsonPath, 'utf-8'))
}

/**
 * Checks if the configuration file exists in the project
 * @returns Object containing availability status and file path
 * @throws Error if filesystem operations fail
 */
export const checkConfigFileAvailability = (): ConfigFileStatus => {
  const NOT_FOUND: ConfigFileStatus = {
    isAvailable: false,
    path: '',
    config: null,
  }

  try {
    const rootDirectory = findProjectRoot(['package.json', 'git', CONFIG_FILE])
    if (!rootDirectory) {
      error(ErrorMessages.ROOT_NOT_FOUND)
      return NOT_FOUND
    }

    const configPath = join(rootDirectory, CONFIG_FILE)
    return existsSync(configPath)
      ? {
        isAvailable: true,
        path: configPath,
        config: JSON.parse(readFileSync(configPath, 'utf8')),
      }
      : (error(ErrorMessages.CONFIG_FILE_NOT_FOUND), NOT_FOUND)
  } catch (err) {
    error(ErrorMessages.FILE_SYSTEM_ERROR, err)
    return NOT_FOUND
  }
}
