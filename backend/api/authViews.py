from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import (
    TechStackSerializer, RegisterSerializer, UserSerializer, 
    MyTokenRefreshSerializer, ProfileSerializer
    )
from rest_framework import status
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.conf import settings
from django.contrib.auth import authenticate
from django.middleware import csrf
from rest_framework import exceptions
from rest_framework.permissions import IsAuthenticated
from backend.models import TechStack

REFRESH_MAX_AGE = 14 * 24 * 3600 #14 days
ACCESS_MAX_AGE = 5 * 60 #14 days


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

#Authenticatoin 

class RegisterApiView(GenericAPIView):
    serializer_class = RegisterSerializer 

    def post(self, request, *args, **kwargs):
        serializedData = self.get_serializer(data = request.data)
        if serializedData.is_valid():
            user = serializedData.save()
            # remember you defined the create method in the RegisterSerializer to return the instance
            # so you'll have to explicitly run save on the returned instance
            user.save()
            return Response({
                'message' : 'user created successfuly', 
                'user' : UserSerializer(user).data
            })
        return Response(serializedData.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request, format = None):
        data = request.data
        response = Response()
        username = data.get('username', None)
        password = data.get('password', None)
        user = authenticate(username = username, password = password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value = data["access"],
                    max_age=  ACCESS_MAX_AGE,
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], 
                    value = data["refresh"],
                    max_age=REFRESH_MAX_AGE,
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                response["X-CSRFToken"] = csrf.get_token(request)
                print(response.cookies)
                response.data = {"Success" : "Login successfully", "data":data}
                return response
            else:
                return Response({"No active" : "This account is not active!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"Invalid" : "Invalid username or password!!"}, status=status.HTTP_404_NOT_FOUND)

class Logout(APIView):
    def get(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        try:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
            RefreshToken(refresh_token).blacklist()
            res = Response()
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'])
            res.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'], samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'])
            return res
        except Exception as e:
            print(e)
            raise exceptions.ParseError("invalid Token")
            

class GetUser(GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, ]
    def get(self, request, *args, **kwargs):
        user = request.user
        profile = request.user.profile
        if not(user or profile):
            return Response({'message' : "user does'nt exist"}, status=status.HTTP_404_NOT_FOUND)
        profile_serializer = ProfileSerializer(profile, context = {"request" : request})
        serializer = self.get_serializer(user)
        return Response({ "user" : serializer.data, "profile" : profile_serializer.data})


class RefreshTokenview(TokenRefreshView):
    serializer_class = MyTokenRefreshSerializer
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('access'):
            response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value = response.data["access"],
                    max_age = ACCESS_MAX_AGE,
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
            del response.data['access']
        if response.data.get('refresh'):
            response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], 
                    value = response.data["refresh"],
                    max_age = REFRESH_MAX_AGE,
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
            del response.data['refresh']
            
        return super().finalize_response(request, response, *args, **kwargs)


class ProfileImageUpdateApiView(GenericAPIView):
    pass 

class ProfileApiView(GenericAPIView):

    def get(self, request, *args, **kwargs):
        pass

    def patch(self, request, *args, **kwargs):
        pass

    def post(self, request, *args, **kwargs):
        pass

class GetTechStacks(GenericAPIView):
    serializer_class = TechStackSerializer
    permission_classes = [IsAuthenticated]
    def get(self, request, *args, **kwargs):
        stacks = TechStack.objects.all()
        return Response(self.get_serializer_class(stacks).data)