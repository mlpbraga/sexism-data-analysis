#!/bin/bash

if [ $1 = 'prod' ]; then
  echo "API_URL=https://foo.bar" >.env
else
  if [ $1 = 'dev-macosx' ]; then
    hostnames=$(ipconfig getifaddr en0)
  else
    hostnames=$(hostname -I)
  fi
  localHostname=$(cut -d ' ' -f 1 <<<"$hostnames")
  echo "API_URL=http://$localHostname:3377" >.env
fi