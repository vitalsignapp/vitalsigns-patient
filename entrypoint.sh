#!/bin/sh

if [ -e /root/index.html ]
then
  rm /var/www/index.html
  cp /root/index.html /var/www/index.html
else
  cp /var/www/index.html /root/index.html
fi


#sed -i 's_<script></script>_<script>window.env = {}; window.env.API\_URL = "'$API_URL'"; window.env.SENTRY\_DSN = "'$SENTRY_DSN'"; window.env.SENTRY\_ENVIRONMENT = "'$SENTRY_ENVIRONMENT'";</script>_g' /var/www/index.html
exec nginx -g "daemon off;"
