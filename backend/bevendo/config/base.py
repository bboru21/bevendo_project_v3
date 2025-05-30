"""
Django settings for bevendo project.

Generated by 'django-admin startproject' using Django 3.2.14.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

from pathlib import Path
from sys import path
from datetime import timedelta


########## PATH CONFIGURATION

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent # bevendo_project/backend/bevendo

# Absolute filesystem path to the Django project directory:
DJANGO_ROOT = BASE_DIR.parent  # bevendo_project/backend

# Add our project to our pythonpath, this way we don't need to type our project
# name in our dotted import paths:
path.append(str(DJANGO_ROOT))
########## END PATH CONFIGURATION


########## MANAGER CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = (
    ('Bryan Hadro', 'bryan.e.hadro@gmail.com'),
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = ADMINS
########## END MANAGER CONFIGURATION


########## SECRET CONFIGURATION
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = ''
########## END SECRET CONFIGURATION


########## DEBUG CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#debug
# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

########## END DEBUG CONFIGURATION


########## SITE CONFIGURATION
# Hosts/domain names that are valid for this site
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts

ALLOWED_HOSTS = []

CORS_ALLOWED_ORIGINS = []

########## END SITE CONFIGURATION


########## APP CONFIGURATION
# Application definition
DJANGO_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'imagekit',
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'scrapy',
)

# Apps specific for this project go here.
LOCAL_APPS = (
    'account.apps.AccountConfig',
    'api.apps.ApiConfig',
    'ext_data.apps.ExtDataConfig',
)

# See: https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + LOCAL_APPS
########## END APP CONFIGURATION


########## LOGGING CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#logging
# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s [%(asctime)s] %(module)s %(message)s',
        },
        'simple': {
            'format': '%(message)s',
        }
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'ERROR',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django.security.DisallowedHost': {
            'handlers': ['null'],
            'propagate': False,
        },
        'django': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'ERROR',
        },
        'account': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'INFO',
        },
        'api': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'INFO',
        },
        'ext_data': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'INFO',
        },
        'module': {
            'handlers': ['console'],
            'propagate': True,
            'level': 'ERROR',
        },
    },
}

########## END LOGGING CONFIGURATION


########## MIDDLEWARE CONFIGURATION
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

########## END MIDDLEWARE CONFIGURATION


########## URL CONFIGURATION
ROOT_URLCONF = 'bevendo.urls'
########## END URL CONFIGURATION


########## TEMPLATE CONFIGURATION
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
########## END TEMPLATE CONFIGURATION


########## WSGI CONFIGURATION
# See: https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = 'bevendo.wsgi.application'
########## END WSGI CONFIGURATION


########## DATABASE CONFIGURATION
# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE':   'mysql.connector.django',
        'NAME': 'bevendo',
        'HOST': '127.0.0.1',
        'PORT': '3306',
        'OPTIONS': {},
    }
}

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
########## END DATABASE CONFIGURATION


########## PASSWORD VALIDATION
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

########## END PASSWORD VALIDATION


########## GENERAL CONFIGURATION

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

########## END GENERAL CONFIGURATION


########## STATIC FILE CONFIGURATION
# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

########## END STATIC FILE CONFIGURATION


########## AUTHENTICATION CONFIGURATION

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1), # 24 hours, must match ACCESS_TOKEN_LIFETIME in config/index.js
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7), # 1 week, must match REFRESH_TOKEN_LIFETIME in config/index.js
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
}

########## END AUTHENTICATION CONFIGURATION

########## BEGIN MEDIA FILES CONFIGURATION

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

########## END MEDIA FILES CONFIGURATION


########## BEGIN EXT DATA CLIENTS CONFIGURATION

EXT_DATA_CLIENT_CACHE_RESPONSE = False
EXT_DATA_CLIENT_USER_AGENTS = []

########## END EXT DATA CLIENTS CONFIGURATION
