#!/bin/bash

echo 'import_calapi_inadiutorium_data'
MAILTO=""

VE_PATH="/home/webmaster/bevendo_project/venv"

cd /home/webmaster/bevendo_project

$VE_PATH/bin/python3 bevendo/manage.py import_calapi_inadiutorium_data --settings bevendo.settings.production
