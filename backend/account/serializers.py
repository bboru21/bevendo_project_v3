from rest_framework import serializers
from django.contrib.auth.models import User
from api.serializers import FavoriteSerializer

class UserSerializer(serializers.ModelSerializer):

    favorites = FavoriteSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'favorites')
