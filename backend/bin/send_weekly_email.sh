#!/bin/bash

echo 'send_weekly_email'
MAILTO=""

VE_PATH="/home/webmaster/bevendo_project/venv"

cd /home/webmaster/bevendo_project

$VE_PATH/bin/python3 bevendo/manage.py send_weekly_email --settings bevendo.settings.production
