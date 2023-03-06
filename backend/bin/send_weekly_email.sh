#!/bin/bash

echo 'send_weekly_email'
MAILTO=""

VE_PATH="/home/webmaster/bevendo_project/backend/venv"

cd /home/webmaster/bevendo_project/backend

$VE_PATH/bin/python3 manage.py send_weekly_email --settings bevendo.config.production
