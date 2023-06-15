import logging

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.conf import settings

from .serializers import UserSerializer
from .tokens import password_reset_token


logger = logging.getLogger(__name__)


MIN_PASSWORD_LENGTH = 8


def index(request):
    # logger.error("API Index Page error")
    # logger.info("API Index Page info")
    # logger.debug("API Index Page debug")
    # logger.warn("API Index page warning")
    return HttpResponse("API Index Page")


class SendPasswordResetEmail(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):

        try:
            data = request.data
            email = data['email']
            user = User.objects.get(email=email)

            if user:

                user.is_active = False
                user.profile.reset_password = True

                reset_url = f'{settings.FRONTEND_URL}/reset-password?uidb64={urlsafe_base64_encode(force_bytes(user.pk))}&token={password_reset_token.make_token(user)}'

                message = render_to_string('account/templates/password_reset_email.txt', {
                    'name': user.first_name,
                    'reset_url': reset_url,
                })
                html_message = render_to_string('account/templates/password_reset_email.html', {
                    'name': user.first_name,
                    'reset_url': reset_url,
                })

                success = send_mail(
                    subject=f'Reset password for {settings.FRONTEND_URL}',
                    message=message,
                    html_message=html_message,
                    from_email=settings.SENDER_EMAIL,
                    recipient_list=[email],
                )

                if success > 0:

                    # update user and profile only after email sent
                    user.save()

                    return Response(
                        {'success': f'If this mail address is known to us, a message will be sent to the provided email address'},
                        status=status.HTTP_200_OK,
                    )

                else:
                    logger.warn(f'email failed to send to {email}')
                    return Response(
                        {'error': 'Something went wrong when attempting to send password reset email'},
                        status=status.HTTP_500_SERVER_ERROR,
                    )
            else:
                logger.warn(f'user with email {email} does not exist, returning status 200')
                return Response(
                    {'error': f'If this mail address is known to us, a message will be sent to the provided email address'},
                    status=status.HTTP_200_OK,
                )

        except BaseException as error:
            logger.error(f'error occured while attempting to send password reset email: {error}')
            return Response(
                {'error': 'Something went wrong when attempting to send password reset email'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ResetPasswordView(APIView):

    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            data = request.data

            uid = urlsafe_base64_decode(data['uidb64'])
            token = data['token']
            password = data['password']
            re_password = data['re_password']

            if password == re_password:
                if len(password) >= MIN_PASSWORD_LENGTH:

                    user = User.objects.get(pk=uid)
                    if user:
                        if password_reset_token.check_token(user, token):
                            user.set_password(password)
                            user.is_active = True
                            user.profile.reset_password = False
                            user.save()

                            return Response(
                                {'success': 'Password successfully reset, please login using your new password'},
                                status=status.HTTP_200_OK,
                            )

                        else:
                            logger.warn("check token failed for user {user.pk} and token {token}")
                            return Response(
                                { 'error': 'Token is no longer valid, please restart the reset password process' },
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        logger.warn("error occured during user lookup for uid {uid}")
                        return Response(
                            { 'error': 'No user found, please restart the password reset process' },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    logger.warn(f'password length is less than {MIN_PASSWORD_LENGTH} characters, returning status 400')
                    return Response(
                        {'error': f'Password must be at least {MIN_PASSWORD_LENGTH} characters in length'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                logger.warn('new passwords do not match, returning status 400')
                return Response(
                    {'error': 'New passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except BaseException as error:
            logger.error(f"Something went wrong when attempting to reset password: {error}")
            return Response(
                {'error': 'Something went wrong when attempting to reset password'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ChangeEmailView(APIView):

    def post(self, request):
        try:
            request_user = request.user
            user = User.objects.get(username=request_user.username)
            if user:
                data = request.data
                email = data['email']
                re_email = data['re_email']

                if email == re_email:
                    user.email = email
                    user.save()
                    return Response(
                        {'success': 'Email successfully changed'},
                        status=status.HTTP_200_OK,
                    )

                else:
                    logger.warn('new emails do not match, returning status 400')
                    return Response(
                        {'error': 'New emails do not match'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                logger.warn(f'user with username {request_user.username} does not exist, returning status 400')
                return Response(
                    {'error': f'User with username {request_user.username} not found'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except BaseException as error:
            logger.error(f'error occured while changing email: {error}')
            return Response(
                {'error': 'Something went wrong when trying to change your email address'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ChangePasswordView(APIView):

    def post(self, request):
        try:

            request_user = request.user
            user = User.objects.filter(username=request_user.username)
            if user.exists():
                user = user.first()

                data = request.data
                current_password = data['current_password']
                new_password = data['new_password']
                re_new_password = data['re_new_password']

                if user.check_password(current_password):

                    if new_password == re_new_password:

                        if len(new_password) >= MIN_PASSWORD_LENGTH:
                            user.set_password(new_password)
                            user.save()
                            return Response(
                                {'success': 'Password successfully changed'},
                                status=status.HTTP_200_OK,
                            )
                        else:
                            logger.warn(f'password length is less than {MIN_PASSWORD_LENGTH} characters, returning status 400')
                            return Response(
                                {'error': f'Password must be at least {MIN_PASSWORD_LENGTH} characters in length'},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    else:
                        logger.warn('new passwords do not match, returning status 400')
                        return Response(
                            {'error': 'New passwords do not match'},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                else:
                    return Response(
                        {'error': f'Current password does not match'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                logger.warn(f'user with username {request_user.username} does not exist, returning status 400')
                return Response(
                    {'error': f'User with username {request_user.username} not found'},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        except BaseException as error:
            logger.error(f'error occured while changing password: {error}')
            return Response(
                {'error': 'Something went wrong when trying to change your password'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class RegisterView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            data = request.data

            first_name = data['first_name']
            last_name = data['last_name']
            username = data['username']
            password = data['password']
            re_password = data['re_password']

            if password == re_password:
                if len(password) >= MIN_PASSWORD_LENGTH:
                    if not User.objects.filter(username=username).exists():
                        user = User.objects.create_user(
                            first_name = first_name,
                            last_name = last_name,
                            username = username,
                            password = password,
                        )
                        user.save()
                        if User.objects.filter(username=username).exists():
                            return Response(
                                {'success': 'Account created successfully'},
                                status=status.HTTP_201_CREATED,
                            )
                        else:
                            logger.error(f'user {user.username} was created, but unable to be retrieved after save')
                            return Response(
                                {'error': 'Something went wrong when trying to create account'},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            )
                    else:
                        logger.warn('username already exists, returning status 400')
                        return Response(
                            {'error': 'Username already exists'},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                else:
                    logger.warn(f'password length is less than {MIN_PASSWORD_LENGTH} characters, returning status 400')
                    return Response(
                        {'error': f'Password must be at least {MIN_PASSWORD_LENGTH} characters in length'},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            else:
                logger.warn('passwords do not match, returning status 400')
                return Response(
                    {'error': 'Passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        except BaseException as error:
            logger.error(f'error occured during registration: {error}')
            return Response(
                {'error': 'Something went wrong when trying to register account'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class LoadUserView(APIView):
    def get(self, request, format=None):
        try:
            user = request.user
            user = UserSerializer(user)

            return Response(
                {'user': user.data},
                status=status.HTTP_200_OK,
            )
        except BaseException as error:
            logger.error('error occured when loading user {request.user}: {error}')
            return Response(
                {'error': 'Something went wrong when trying to load user'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
