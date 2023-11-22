import { Command } from 'commander'
import * as parsers from '../parsers'
import { updateConfig } from '../config'
import chalk from 'chalk'
import { CLI_CONFIG_FILE_PATH } from '../constants'

export interface ConfigSetOptions {
  rpcUrl?: string
  privateKey?: string
}

export const useConfigSetCommand = (program: Command) => {
  program
    .command('config:set')
    .description('Configure cli and save config file in home directory')
    .option('-r, --rpcUrl [string]', 'Rpc url of EVM node', parsers.url)
    .option(
      '-k, --privateKey [string]',
      'Private key of wallet used to send transactions',
      parsers.privateKey,
    )
    .action(async (opts: ConfigSetOptions) => {
      await updateConfig(opts)

      if (opts.privateKey) {
        console.log(
          chalk.yellow(`Your private key is stored in ${CLI_CONFIG_FILE_PATH}`),
        )
        console.log(
          chalk.yellow(`It can be removed at any time with config:purge`),
        )
      }
    })
}
