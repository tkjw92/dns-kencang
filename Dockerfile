FROM alpinelinux/unbound

COPY --chmod=755 ./entrypoint.sh /usr/local/bin/entrypoint.sh