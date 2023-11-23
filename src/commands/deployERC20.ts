import { Command } from 'commander'
import * as parsers from '../parsers'
import { getConfig } from '../config'
import chalk from 'chalk'
import { Wallet, JsonRpcProvider } from 'ethers'
import { Token__factory } from '../contracts/Token__factory'

export interface DeployERC20Options {
  name: string
  symbol: string
  totalSupply: string
  decimals: number
}

export const useDeployERC20Command = (program: Command) => {
  program
    .command('deploy:erc20')
    .description('Deploy simple ERC20 contract')
    .requiredOption('--name <string>', 'Token name')
    .requiredOption('--symbol <string>', 'Token symbol')
    .requiredOption(
      '--totalSupply <amount>',
      'Token total supply (without additional decimal zeros)',
      parsers.natural,
    )
    .requiredOption('--decimals [uint]', 'Token decimals', parsers.uint, 18)
    .action(async (opts: DeployERC20Options) => {
      const config = await getConfig()
      if (!config) return

      const provider = new JsonRpcProvider(config.rpcUrl)
      const wallet = new Wallet(config.privateKey, provider)

      const factory = new Token__factory(wallet)

      const totalSupply =
        BigInt(Math.floor(Number(opts.totalSupply))) *
        10n ** BigInt(Number(opts.decimals))

      const token = await factory.deploy(
        opts.name,
        opts.symbol,
        totalSupply,
        opts.decimals,
      )

      console.log(chalk.green(`Token deployed as ${await token.getAddress()}`))
    })
}
