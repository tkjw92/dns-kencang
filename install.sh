#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

install_rpz () {    
    cp nginx-sites-restrict /etc/nginx/sites-enabled/restrict
    cp restrict.html /var/www/html/index.html
    cp db.rpz /etc/unbound

    while true; do
        read -p "Main Domain (ex: dns-kencang.com): " main_domain
        main_domain=$(echo "$main_domain" | xargs)
        if [[ "$main_domain" != "" ]]; then
            break
        fi
    done

    while true; do
        read -p "Restrict Domain (ex: blokir.dns-kencang.com): " restrict_domain
        restrict_domain=$(echo "$restrict_domain" | xargs)
        if [[ "$restrict_domain" != "" ]]; then
            break
        fi
    done

    first_restrict_domain="${restrict_domain%.$main_domain}"

    while true; do
        read -p "IP Address This DNS Server (ex: 192.168.100.2): " ip_dns
        ip_dns=$(echo "$ip_dns" | xargs)
        if [[ "$ip_dns" != "" ]]; then
            break
        fi
    done

    while true; do
        read -p "Server Threads (ex: 4): " server_threads
        server_threads=$(echo "$server_threads" | xargs)
        if [[ "$server_threads" != "" ]]; then
            break
        fi
    done

    current_serial="$(date +%Y%m%d)01"

    sed \
        -e "s/dns-kencang/$main_domain/g" \
        -e "s/restrict/$first_restrict_domain/g" \
        -e "s/ip-dns/$ip_dns/g" \
        -e "s/@serial/$current_serial/g" \
        db.template > "/tmp/db.$main_domain"

    sed \
        -e "s/@restrict-domain/$restrict_domain/g" \
        -e "s/@threads/$server_threads/g" \
        -e "s/@main-domain/$main_domain/g" \
        unbound-rpz.conf > /tmp/unbound-rpz.conf

    mv /tmp/unbound-rpz.conf /etc/unbound/unbound.conf
    mv "/tmp/db.$main_domain" "/etc/unbound/db.$main_domain"
}

print_logo () {
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
}

print_logo

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
cp -r blocklists.conf unbound.conf /etc/unbound

echo -e "${NC}"

# Get input from user
# Install RPZ or Not
echo "Install RPZ Rules? "
select is_rpz in "Yes" "No"; do
    case $is_rpz in
        Yes ) install_rpz; break;;
        No ) break;;
    esac
done

# Enable all services
systemctl enable --now nginx cron unbound > /dev/null 2>&1
systemctl restart nginx cron unbound

clear
print_logo

echo -e " ${GREEN} Success install DNS-Kencang."
echo -e "${NC}"

echo -e " [+] unbound: $(systemctl status unbound | grep Active) "
echo -e " [+] nginx: $(systemctl status nginx | grep Active) "

echo ""

echo -e " [+] Dashboard running on: http://0.0.0.0:8080"
echo -e " [+] DNS Server running on: 0.0.0.0:53"

echo ""

echo -e " [i] Jika anda menjalankan installasi RPZ, anda bisa melakukan modifikasi html restrict page pada: /var/www/html/index.html"

echo ""
