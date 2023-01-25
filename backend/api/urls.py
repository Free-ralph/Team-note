from django.urls import path
from .authViews import RegisterApiView, LoginView, GetUser, RefreshTokenview, Logout
from .view import TagApiView, NoteApiView, NoteListApiView, TeamApiView


urlpatterns = [
    path('note', NoteApiView.as_view()),
    path('note/<int:note_id>', NoteApiView.as_view()),
    path('notes', NoteListApiView.as_view()),
    path('tag', TagApiView.as_view()),
    path('team', TeamApiView.as_view()),
    path('team/<str:team_id>', TeamApiView.as_view()),


    # Auth
    path('auth/register', RegisterApiView.as_view()),
    path('auth/login', LoginView.as_view()),
    path('auth/logout', Logout.as_view()),
    path('auth/user', GetUser.as_view()),
    path('auth/refresh', RefreshTokenview.as_view()),
]