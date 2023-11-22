#!/bin/sh

mkdir -p ~/.local/bin

curl -o ~/.local/bin/sk-eth-cli -L https://github.com/skey-network/dev-env-setuper-eth-cli/raw/main/bin/sk-eth-cli

chmod +x ~/.local/bin/sk-eth-cli

sk-eth-cli --help
