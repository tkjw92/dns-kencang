#!/bin/sh

for i in server control; do
	if [ ! -f /etc/unbound/unbound_$i.key ] ||
		[ ! -f /etc/unbound/unbound_$i.pem ]; then
		unbound-control-setup && break
	fi
done

unbound-anchor -a /etc/unbound/root.key
chown -R unbound:unbound /etc/unbound

# Custom startup process
if [ -f "/etc/config/blocklist" ] && [ -f "/etc/config/unbound.conf" ]; then

	tmpfile=$(mktemp)
	while read -r line; do
		echo "local-zone: \"$line\" refuse" >>"$tmpfile"
	done <"/etc/config/blocklist"

	cat "/etc/config/unbound.conf" "$tmpfile" >/etc/unbound/unbound.conf

	# Cleanup
	rm -rf "$tmpfile"
else
	cat "/etc/config/unbound.conf" >/etc/unbound/unbound.conf
fi

exec unbound -dp
