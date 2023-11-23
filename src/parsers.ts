import { InvalidOptionArgumentError } from 'commander'
import { Wallet, ethers } from 'ethers'

export const natural = (val: string) => {
  const num = Number(val)

  if (!Number.isSafeInteger(num) || num < 1) {
    throw new InvalidOptionArgumentError(
      'Must be integer value greater than zero (JS safe integer)',
    )
  }

  return num
}

export const uint = (val: string) => {
  const num = Number(val)

  if (!Number.isSafeInteger(num) || num < 0) {
    throw new InvalidOptionArgumentError(
      'Must be integer value greater or equal to zero (JS safe integer)',
    )
  }

  return num
}

export const url = (val: string) => {
  try {
    new URL(val)
    return val
  } catch {
    throw new InvalidOptionArgumentError('Must be valid url')
  }
}

export const privateKey = (val: string) => {
  try {
    new Wallet(val?.replace('0x', ''))
    return val
  } catch {
    throw new InvalidOptionArgumentError('Must be valid EVM private key')
  }
}

export const amount = (val: string) => {
  try {
    ethers.parseEther(val)
    return val
  } catch {
    throw new InvalidOptionArgumentError(
      'Must be valid token amount, such as 0.1, 10000, 20.37, etc',
    )
  }
}

export const address = (val: string) => {
  if (ethers.isAddress(val)) {
    return val
  }

  throw new InvalidOptionArgumentError('Must be valid EVM address')
}
