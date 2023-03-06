#!/bin/bash

echo 'import_abc_data'
MAILTO=""

VE_PATH="/home/webmaster/bevendo_project/backend/venv"

cd /home/webmaster/bevendo_project/backend

$VE_PATH/bin/python3 manage.py import_abc_data --settings bevendo.config.prod && $VE_PATH/bin/python3 manage.py process_abc_data --settings bevendo.config.prod