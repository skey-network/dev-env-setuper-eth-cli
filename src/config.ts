import * as fs from 'node:fs/promises'
import chalk from 'chalk'
import { CLI_CONFIG_DIR_PATH, CLI_CONFIG_FILE_PATH } from './constants'

export interface Config {
  rpcUrl: string
  privateKey: string
}

export const saveJSON = async (path: string, obj: any) => {
  await fs.writeFile(path, JSON.stringify(obj, null, 2) + '\n', 'utf8')
}

export const loadJSON = async (path: string) => {
  return await fs.readFile(path, 'utf8').then((f) => JSON.parse(f))
}

export const getPartialConfig = async (): Promise<Partial<Config> | null> => {
  const exists = await fs.exists(CLI_CONFIG_FILE_PATH)

  if (!exists) {
    console.log(chalk.red(`Config file not found in ${CLI_CONFIG_FILE_PATH}`))
    return null
  }

  const file = await fs.readFile(CLI_CONFIG_FILE_PATH, 'utf8')

  return JSON.parse(file)
}

export const getConfig = async (): Promise<Config | null> => {
  const config = await getPartialConfig()
  if (!config) return null

  if (!config.rpcUrl || !config.privateKey) {
    console.log(chalk.red(`Missing properties in config file`))
    return null
  }

  return config as any
}

export const updateConfig = async (obj: Partial<Config>) => {
  const exists = await fs.exists(CLI_CONFIG_FILE_PATH)

  if (!exists) {
    await fs.mkdir(CLI_CONFIG_DIR_PATH, { recursive: true })
    await saveJSON(CLI_CONFIG_FILE_PATH, obj)
  } else {
    const file = await fs.readFile(CLI_CONFIG_FILE_PATH, 'utf8')
    const updated = { ...JSON.parse(file), ...obj }

    await saveJSON(CLI_CONFIG_FILE_PATH, updated)
  }
}

export const purgeConfig = async () => {
  const exists = await fs.exists(CLI_CONFIG_FILE_PATH)

  if (!exists) {
    console.log(chalk.red(`Config file not found in ${CLI_CONFIG_FILE_PATH}`))
    return false
  }

  await fs.writeFile(
    CLI_CONFIG_FILE_PATH,
    Array(256).fill('0').join(''),
    'utf8',
  )

  await fs.rm(CLI_CONFIG_FILE_PATH)

  return true
}
