from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):

    # TODO should invest the time to use related_name favorites to expose cocktail id
    favorites = serializers.SerializerMethodField()

    def get_favorites(self, obj):
        return obj.favorites.values_list("cocktail__pk", flat=True)

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'favorites')
