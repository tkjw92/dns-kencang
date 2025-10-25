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
	while IFS= read -r line || [ -n "$line" ]; do
		line=$(echo "$line" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')
		if [ "$line" != "" ]; then
			echo "local-zone: \"$line\" refuse" >>"$tmpfile"
		fi
	done <"/etc/config/blocklist"

	cat "/etc/config/unbound.conf" "$tmpfile" >/etc/unbound/unbound.conf

	# Cleanup
	rm -rf "$tmpfile"
else
	cat "/etc/config/unbound.conf" >/etc/unbound/unbound.conf
fi

exec unbound -dp
