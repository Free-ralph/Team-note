from rest_framework import serializers
from backend.models import Note, Profile, Team, Tag, TechStack
from django.contrib.auth.models import User
from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username', 
            'email', 
            'password',
        ]

    def validate(self, data):
        user = User(**data)
        password = data.get('password')
        errors = dict()
        

        try :
            password_validation.validate_password(password=password, user = user)
        except ValidationError as e:
            errors['password'] = list(e)

        if errors :
            raise serializers.ValidationError(errors)
        
        return super().validate(data)

    def create(self, validated_data):
        password = validated_data.get('password')
        user  = User(**validated_data)
        user.set_password(password)
        return user 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username', 
            'email'
        ]


class MyTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None
    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if attrs['refresh']:
            return super().validate(attrs)
        raise InvalidToken("No valid token found in cookie \'refresh\' ")


class TagSerializer(serializers.ModelSerializer):
    id = serializers.CharField(max_length = 10, required = False, allow_blank = True, allow_null = True)
    class Meta:
        model = Tag
        fields = [
            'id', 
            'label'
        ]
        
class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many = True)
    class Meta:
        model = Note
        depth = 1
        fields = [
            'title', 
            'markdown',
            'tags'
        ]
        extra_kwargs = {"profile" :{"required" : False}}


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile 
        fields = [
            'profile_id', 
            'name', 
            'image',
        ]
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            image_url = obj.image.url
            return request.build_absolute_uri(image_url)

class ProfileFetchSerializer(serializers.Serializer):
    profile_id = serializers.CharField(max_length = 10)
    roles = serializers.CharField(max_length = 100)


class TeamPostSerializer(serializers.ModelSerializer):
    members = ProfileFetchSerializer(many = True)
    class Meta:
        model = Team
        fields = [
            'name',
            'members',
            'rules', 
            'about'
        ]

class TeamGetSerializer(serializers.ModelSerializer):
    members = ProfileSerializer(many = True, read_only = True)
    class Meta:
        model = Team
        fields = [
            'name',
            'members',
            'rules', 
            'about'
        ]

class TechStackSerializer(serializers.ModelSerializer):
    id = serializers.CharField(max_length = 10, required = False, allow_blank = True, allow_null = True)
    class Meta:
        models = TechStack
        fields = [
            'id', 
            'label'
        ]