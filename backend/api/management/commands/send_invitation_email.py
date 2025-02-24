import logging
import re

from django.contrib.auth.models import User
from django.core import management
from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from datetime import (
    datetime,
)

from django.template.loader import render_to_string
from django.core.mail import send_mail


logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'One time script to send a Bevendo account invite email to existing users'

    def add_arguments(self, parser):
        parser.add_argument(
            '--group',
            '-g',
            type=str,
            help='name of the group whose members will be e-mailed',
            default='Weekly E-Mail Test', # 'Weekly E-Mail'
        )
        parser.add_argument(
            '--users',
            '-u',
            type=str,
            help='usernames within the group who will be e-mailed',
            nargs='+',
        )

    def handle(self, *args, **options):

        users = User.objects.filter(groups__name=options['group']).filter(is_active=True)

        if options['users']:
            users = users.filter(username__in=options['users'])

        if users.count == 0:
            logger.debug(f"No users found within group {options['group']} with usernames {options['users']}")
            return

        for user in users:

            message = render_to_string('api/templates/invitation_email.txt', {
                'first_name': user.first_name,
                'username': user.username,
                'password': 'changeme123!',
            })

            html_message = render_to_string('api/templates/invitation_email.html', {
                'first_name': user.first_name,
                'username': user.username,
                'password': 'changeme123!',
            })

            success = send_mail(
                subject=f'Invite for bevendo.app',
                message=message,
                html_message=html_message,
                from_email=settings.SENDER_EMAIL,
                recipient_list=[user.email],
            )
            logger.debug(f'email to {user.first_name} {user.last_name} returned value {success}')

        now = datetime.now()
        dt_string = now.strftime("%m/%d/%Y %H:%M:%S")
        logger.info(f'send_invitation_email script ran {dt_string}')
