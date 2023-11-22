import * as fs from 'node:fs/promises'
import { Command } from 'commander'
import * as parsers from '../parsers'
import { Wallet } from 'ethers'
import chalk from 'chalk'

export interface WalletsGenerateOptions {
  outFile?: string
}

export const useWalletsGenerateCommand = (program: Command) => {
  program
    .command('wallets:generate')
    .description('Generate n wallets')
    .argument('<n>', 'Number of new wallets to generate ', parsers.natural)
    .option('-o, --outFile [path]', 'Path to file where data will be saved')
    .action(async (n: number, opts: WalletsGenerateOptions) => {
      const wallets = Array(n)
        .fill(null)
        .map(() => Wallet.createRandom())
        .map((wallet) => ({
          address: wallet.address,
          privateKey: wallet.privateKey,
        }))

      if (!opts.outFile) {
        console.log(wallets)
      }

      if (opts.outFile) {
        await fs.writeFile(
          opts.outFile,
          JSON.stringify(wallets, null, 2) + '\n',
          'utf8',
        )

        console.log(chalk.green(`Wallets saved in ${opts.outFile}`))
      }
    })
}
