import logging
import unittest
from datetime import (
    datetime,
    timedelta,
)

from django.core.management import BaseCommand
from django.core.management import call_command


logger = logging.getLogger(__name__)


class Command(BaseCommand):

    help='tests sending the weekly email'

    def handle(self, *args, **options):
        call_command('send_weekly_email', group_name='Weekly E-Mail Test')
