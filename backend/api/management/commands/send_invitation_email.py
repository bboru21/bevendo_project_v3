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
            '--group_name',
            type=str,
            help='name of the group to send the e-mail to',
            default='Weekly E-Mail',
        )

    def handle(self, *args, **options):

      users = User.objects.filter(groups__name=options['group_name']).filter(is_active=True)

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
            subject=f'Invite for bevendo.online',
            message=message,
            html_message=html_message,
            from_email=settings.SENDER_EMAIL,
            recipient_list=[user.email],
        )

        now = datetime.now()
        dt_string = now.strftime("%d/%m/%Y %H:%M:%S")
        logger.info(f'send_invitation_email script ran {dt_string}')
