#!/bin/bash

set -m

/iris-main "$@" &

/usr/irissys/dev/Cloud/ICM/waitISC.sh
iris session iris -U%SYS '##class(Security.Users).Create("django","%ALL","django")' || true
#
cd /usr/irissys/csp/sheltershare
export IRISUSERNAME=_system
export IRISPASSWORD=SYS
export IRISNAMESPACE=USER
/usr/irissys/bin/irispython /usr/irissys/csp/sheltershare/irissetup.py
/usr/irissys/bin/irispython manage.py collectstatic --noinput &&
/usr/irissys/bin/irispython manage.py makemigrations &&
/usr/irissys/bin/irispython manage.py migrate &&
/usr/irissys/bin/irispython manage.py makemigrations shshapp&&
/usr/irissys/bin/irispython manage.py migrate shshapp &&
/usr/irissys/bin/irispython manage.py loaddata shshapp/fixtures/* &&
/usr/irissys/bin/irispython -muvicorn shshproj.asgi:application --reload --host 0.0.0.0 --port 8000 --workers 2 --log-level debug &&


fg %1