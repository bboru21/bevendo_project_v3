from django.core.management import BaseCommand

from django.contrib.auth.models import User
from account.models import Profile

class Command(BaseCommand):

    help = 'one-time command to add Profile instances for all existing User instances'

    def handle(self, *args, **options):
        for user in User.objects.all():
            if not hasattr(user, 'profile'):
                profile = Profile(user=user)
                profile.save()
                print(f'{profile} created')
            else:
                profile = user.profile
                print(f'{profile} exists')
