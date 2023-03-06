#!/bin/bash

echo 'import_abc_data'
MAILTO=""

VE_PATH="/home/webmaster/bevendo_project/venv"

cd /home/webmaster/bevendo_project

$VE_PATH/bin/python3 bevendo/manage.py import_abc_data --settings bevendo.settings.production && $VE_PATH/bin/python3 bevendo/manage.py process_abc_data --settings bevendo.settings.production