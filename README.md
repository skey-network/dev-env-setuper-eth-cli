### Install

```sh
curl -sL https://github.com/skey-network/dev-env-setuper-eth-cli/raw/main/scripts/install.sh | sh
```

### Configure

```sh
# Example values
sk-eth-cli config:set --rpcUrl https://ethereum-sepolia.publicnode.com
sk-eth-cli config:set --privateKey 0xad51b2dd053dc256d73c2c89794bb65db531d082c34035311a649d5033cb08c1
```

### Example use case 1 (create random wallets, transfer eth and erc20 token)

```sh
# Create 10 random wallets and save to wallets.json
sk-eth-cli wallets:generate 10 -o wallets.json

# Transfer 0.01 ETH to each wallet address
sk-eth-cli wallets:distribute 0.01 wallets.json

# Transfer 10 USDT to each wallet address
sk-eth-cli wallets:distribute 10 wallets.json --tokenAddress 0xdAC17F958D2ee523a2206206994597C13D831ec7
```

### Example use case 2 (deploy erc20 contract)

```sh
sk-eth-cli deploy:erc20 --name TestToken --symbol TT --totalSupply 1000000000 --decimals 18
```

### Uninstall

```sh
curl -sL https://github.com/skey-network/dev-env-setuper-eth-cli/raw/main/scripts/uninstall.sh | sh
```
