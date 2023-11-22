import { Command } from 'commander'
import { purgeConfig } from '../config'
import chalk from 'chalk'

export const useConfigPurgeCommand = (program: Command) => {
  program
    .command('config:purge')
    .description('Remove config file from home directory')
    .action(async () => {
      if (await purgeConfig()) {
        console.log(chalk.green(`Config file overwritten and removed`))
      }
    })
}
