#!/bin/bash

apt update -y
apt install git git-lfs -y

git clone https://github.com/tkjw92/dns-kencang /opt/dns-kencang
cd /opt/dns-kencang

chmod +x install.sh

./install.sh