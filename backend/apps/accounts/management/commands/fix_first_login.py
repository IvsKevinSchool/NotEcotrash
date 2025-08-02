from django.core.management.base import BaseCommand
from apps.accounts.models import User

class Command(BaseCommand):
    help = 'Set is_first_login=False for all existing users.'

    def handle(self, *args, **options):
        updated = User.objects.filter(is_first_login=True).update(is_first_login=False)
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated} users.'))
