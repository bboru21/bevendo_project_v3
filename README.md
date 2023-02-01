# Bevendo

A Django/React companion app to "[Drinking with the Saints]".

Django layout is based off of the [Django Twoscoops Project].

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

As an alternative startup, you may also run the following from the root directory:

    $ make api

## NextJS

First time development setup:

    frontend$ npm install

Startup the React/NextJS frontend:

    frontend$ npm run dev

As an alternative starup, you may also run the following from the root directory:

    $ make serve

If all was successful, the app should be accessible via the URL:

    http://0.0.0.0:3001/

[django twoscoops project]: https://github.com/twoscoops/django-twoscoops-project/
[drinking with the saints]: https://drinkingwiththesaints.com/
[calapi inadiutorium api]: http://calapi.inadiutorium.cz/
[python unittest testcase]: https://docs.python.org/3/library/unittest.html#unittest.TestCase
[django testing]: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/Testing