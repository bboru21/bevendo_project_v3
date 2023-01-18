# Bevendo v3

Version 3.0 of Bevendo, a companion app to Drinking with the Saints.

# Django

Python 3.7.

# NextJS

# Getting Started

Instructions for starting up the dev scripts for development.

## Python

First time development setup:

    backend$ python3 -m venv venv
    backend$ pip install --upgrade pip
    backend$ pip install -r requirements/dev.txt

Startup the Python/Django backend API:

    backend$ source venv/bin/activate
    backend$ python manage.py runserver 0.0.0.0:9001 --settings bevendo.config.local

## NextJS

First time development setup:

    frontend$ npm install

Startup the React/NextJS frontend:

    frontend$ npm run dev

If all was successful, the app should be accessible via the URL:

    http://0.0.0.0:3001/