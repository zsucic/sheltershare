#!/bin/bash

set -m

/iris-main "$@" &

/usr/irissys/dev/Cloud/ICM/waitISC.sh
iris session iris -U%SYS '##class(Security.Users).Create("django","%ALL","django")' || true
#
cd /home/irisowner/code

python3 manage.py collectstatic --noinput &&
python3 manage.py makemigrations &&
python3 manage.py migrate &&
python3 manage.py makemigrations shshapp&&
python3 manage.py migrate shshapp &&
python3 manage.py loaddata shshapp/fixtures/* &&
/usr/irissys/httpd/bin/httpd -f /home/irisowner/code/sheltersharehttpd.conf -d /usr/irissys/httpd &&
uvicorn shshproj.asgi:application --reload --host 0.0.0.0 --port 8000 --workers 4 --log-level debug &&


fg %1