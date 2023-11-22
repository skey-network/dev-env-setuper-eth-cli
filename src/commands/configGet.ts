import { Command } from 'commander'
import { getPartialConfig } from '../config'

export const useConfigGetCommand = (program: Command) => {
  program
    .command('config:get')
    .description('Print config file')
    .action(async () => {
      const config = await getPartialConfig()

      if (config) {
        console.log(config)
      }
    })
}
