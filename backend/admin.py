from django.contrib import admin
from .models import Profile, Team, Tag, Note


admin.site.register(Profile)
admin.site.register(Tag)
admin.site.register(Team)
admin.site.register(Note)