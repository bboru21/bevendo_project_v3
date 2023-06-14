from django.contrib.auth.tokens import PasswordResetTokenGenerator


class PasswordResetToken(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return user.pk + timestamp + user.profile.reset_password

password_reset_token = PasswordResetToken()
