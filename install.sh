#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

echo ""
echo -e " ${YELLOW}  /\$\$\$\$\$\$\$  /\$\$   /\$\$  /\$\$\$\$\$\$          /\$\$   /\$\$                                                             "
echo -e " ${YELLOW} | \$\$__  \$\$| \$\$\$ | \$\$ /\$\$__  \$\$        | \$\$  /\$\$/                                                             "
echo -e " ${YELLOW} | \$\$  \ \$\$| \$\$\$\$| \$\$| \$\$  \__/        | \$\$ /\$\$/   /\$\$\$\$\$\$  /\$\$\$\$\$\$\$   /\$\$\$\$\$\$\$  /\$\$\$\$\$\$  /\$\$\$\$\$\$\$   /\$\$\$\$\$\$  "
echo -e " ${YELLOW} | \$\$  | \$\$| \$\$ \$\$ \$\$|  \$\$\$\$\$\$  /\$\$\$\$\$\$| \$\$\$\$\$/   /\$\$__  \$\$| \$\$__  \$\$ /\$\$_____/ |____  \$\$| \$\$__  \$\$ /\$\$__  \$\$ "
echo -e " ${YELLOW} | \$\$  | \$\$| \$\$  \$\$\$\$ \____  \$\$|______/| \$\$  \$\$  | \$\$\$\$\$\$\$\$| \$\$  \ \$\$| \$\$        /\$\$\$\$\$\$\$| \$\$  \ \$\$| \$\$  \ \$\$ "
echo -e " ${YELLOW} | \$\$  | \$\$| \$\$\  \$\$\$ /\$\$  \ \$\$        | \$\$\  \$\$ | \$\$_____/| \$\$  | \$\$| \$\$       /\$\$__  \$\$| \$\$  | \$\$| \$\$  | \$\$ "
echo -e " ${YELLOW} | \$\$\$\$\$\$\$/| \$\$ \  \$\$|  \$\$\$\$\$\$/        | \$\$ \  \$\$|  \$\$\$\$\$\$\$| \$\$  | \$\$|  \$\$\$\$\$\$\$|  \$\$\$\$\$\$\$| \$\$  | \$\$|  \$\$\$\$\$\$\$ "
echo -e " ${YELLOW} |_______/ |__/  \__/ \______/         |__/  \__/ \_______/|__/  |__/ \_______/ \_______/|__/  |__/ \____  \$\$ "
echo -e " ${YELLOW}                                                                                                    /\$\$  \ \$\$ "
echo -e " ${YELLOW}                                                                                                   |  \$\$\$\$\$\$/ "
echo -e " ${YELLOW}                                                                                                    \______/  "

echo -e " ${YELLOW} Installing: .... "

# Install dependency
apt install -y nginx unbound cron > /dev/null 2>&1

# Move nginx configurations
rm -f /etc/nginx/sites-enabled/default
cp nginx-sites /etc/nginx/sites-enabled/unbound-stats
cp htpasswd /etc/nginx/.htpasswd
cp -r unbound-stats/dist /opt/unbound-stats

# Add worker to cronjob
cp exporter/unbound-stats /opt/unbound-stats
chmod +x /opt/unbound-stats/unbound-stats
sed -i 's/.*unbound-stats//' /etc/crontab
echo "* * * * *       root    cd /opt/unbound-stats && /opt/unbound-stats/unbound-stats" >> /etc/crontab

# Move unbound configurations
cp -r blocklists.conf db.rpz unbound.conf db.192.168.0 /etc/unbound

# Enable all services
systemctl enable --now nginx cron unbound > /dev/null 2>&1
systemctl restart nginx cron unbound

echo -e " ${GREEN} Success install DNS-Kencang."
echo -e "${NC}"

echo -e " [+] unbound: $(systemctl status unbound | grep Active) "
echo -e " [+] nginx: $(systemctl status nginx | grep Active) "

echo ""
