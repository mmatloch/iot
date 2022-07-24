#!/bin/sh

set -e

mkdir -p /var/run/mosquitto \
  && chown --no-dereference --recursive mosquitto /var/run/mosquitto

if ( [ -z "${MOSQUITTO_USERNAME}" ] || [ -z "${MOSQUITTO_PASSWORD}" ] ); then
  echo "MOSQUITTO_USERNAME or MOSQUITTO_PASSWORD not defined"
  exit 1
fi

# Create passwordfile
touch passwordfile
mosquitto_passwd -b passwordfile $MOSQUITTO_USERNAME $MOSQUITTO_PASSWORD

exec "$@"