import { program } from 'commander'
import { useConfigSetCommand } from './commands/configSet'
import { useConfigGetCommand } from './commands/configGet'
import { useConfigPurgeCommand } from './commands/configPurge'
import { CLI_NAME } from './constants'
import { useWalletsGenerateCommand } from './commands/walletsGenerate'
import { useWalletsDistributeCommand } from './commands/walletsdistribute'
import { useDeployERC20Command } from './commands/deployERC20'

program.name(CLI_NAME).description('Common eth tools').version('0.0.1')

useConfigSetCommand(program)
useConfigGetCommand(program)
useConfigPurgeCommand(program)
useWalletsGenerateCommand(program)
useWalletsDistributeCommand(program)
useDeployERC20Command(program)

program.parse(process.argv)
