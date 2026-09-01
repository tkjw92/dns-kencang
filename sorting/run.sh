#!/bin/bash

cd ../shard
split -l 2000 -d ../sorting/trustpositifkominfo domain-

echo "please run main.go: go run . main.go > output/result"