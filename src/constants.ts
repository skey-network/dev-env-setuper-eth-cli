import { homedir } from 'node:os'

export const CLI_NAME = 'sk-eth-cli'

export const CLI_CONFIG_DIR_PATH = `${homedir()}/.config`

export const CLI_CONFIG_FILE_PATH = `${CLI_CONFIG_DIR_PATH}/${CLI_NAME}.json`
