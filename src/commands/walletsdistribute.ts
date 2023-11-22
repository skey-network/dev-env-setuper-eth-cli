import { Command } from 'commander'
import * as parsers from '../parsers'
import { Wallet, ethers } from 'ethers'
import { JsonRpcProvider } from 'ethers'
import { getConfig, loadJSON } from '../config'
import chalk from 'chalk'

const transferNativeToken = async (
  from: Wallet,
  to: string,
  value: bigint,
  nonce: number,
) => {
  return await from.sendTransaction({
    from: from.address,
    to,
    value: value,
    nonce: nonce,
  })
}

const transferERC20Token = async (
  from: Wallet,
  to: string,
  value: bigint,
  nonce: number,
  tokenAddress: string,
) => {
  const encoder = ethers.AbiCoder.defaultAbiCoder()
  const selector = ethers.id('transfer(address,uint256)')
  const args = encoder.encode(['address', 'uint256'], [to, value])
  const data = selector.slice(0, 10) + args.slice(2)

  return await from.sendTransaction({
    from: from.address,
    to: tokenAddress,
    nonce,
    data,
  })
}

const transferAnyToken = async (
  from: Wallet,
  to: string,
  value: bigint,
  nonce: number,
  tokenAddress?: string,
) => {
  if (tokenAddress) {
    return await transferERC20Token(from, to, value, nonce, tokenAddress)
  } else {
    return await transferNativeToken(from, to, value, nonce)
  }
}

export const useWalletsDistributeCommand = (program: Command) => {
  program
    .command('wallets:distribute')
    .description('Transfer <amount> of tokens to each wallet from the list')
    .argument(
      '<amount>',
      'Amount of tokens to transfer to each wallet',
      parsers.amount,
    )
    .argument('<path>', 'Path to json file containing wallets')
    .option(
      '-t, --tokenAddress <address>',
      'Address of ERC20 compatible contract to use instead of native tokens',
      parsers.address,
    )
    .action(
      async (amount: string, path: string, opts: { tokenAddress?: string }) => {
        const config = await getConfig()
        if (!config) return

        const provider = new JsonRpcProvider(config.rpcUrl)
        const wallet = new Wallet(config.privateKey, provider)

        const data = await loadJSON(path)
        const wallets: Wallet[] = data.map(
          (item: any) => new Wallet(item.privateKey),
        )

        const nonce = await wallet.getNonce()
        const value = ethers.parseEther(amount)

        let someError = false

        const promises = wallets.map(async (recipient, i) => {
          try {
            const tx = await transferAnyToken(
              wallet,
              recipient.address,
              value,
              nonce + i,
              opts.tokenAddress,
            )

            return { recipient, tx }
          } catch (err) {
            someError = true
            console.error(err)
            return { recipient, err }
          }
        })

        const results = await Promise.all(promises)

        if (someError) {
          console.log(chalk.red(`\nSome transactions failed\n`))
        }

        results.forEach((result) => {
          if (result.err) {
            console.log(chalk.red(`[FAIL] ${result.recipient.address}`))
          }

          if (result.tx) {
            console.log(chalk.green(`[DONE] ${result.recipient.address}`))
          }
        })
      },
    )
}
