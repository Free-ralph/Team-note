from django.db import models
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.db.models.signals import post_save
import random, string

#TODO Make sure all null values are removed before deploying

class Profile(models.Model):
    name = models.CharField(max_length=150, null = True)
    profile_id = models.CharField(max_length=10, unique = True, null = True)
    image = models.ImageField( default='profile/default.jpg')
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    
    def save(self, *args, **kwargs):
        if not self.profile_id:
            while True:
                ID = ''.join(random.choices(string.digits + string.ascii_uppercase, k = 5))
                if not Profile.objects.filter(profile_id = ID).exists():
                    self.profile_id = ID
                    break
        return super(Profile, self).save(*args, **kwargs)


    def __str__(self):
        return self.name if self.name else "anonymous"

class Note(models.Model):
    title = models.CharField(max_length=200)
    markdown = models.TextField()
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name="notes", null = True)
    created_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField("Tag", related_name = "notes")   

    def __str__(self):
        return self.title
    

class Tag(models.Model):
    label = models.CharField(max_length = 200)

    def __str__(self):
        return self.label

class Team(models.Model):
    name = models.CharField(max_length=200, unique = True)
    rules = models.TextField(null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    refID = models.CharField(max_length=10, unique = True)
    members = models.ManyToManyField(Profile)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.refID:
            while True:
                ID = ''.join(random.choices(string.digits + string.ascii_uppercase, k = 5))
                if not Team.objects.filter( refID = ID).exists():
                    self.refID = ID
                    break
        return super(Team, self).save(*args, **kwargs)

class TechStack(models.Model):
    label = models.CharField(max_length = 200)

    def __str__(self):
        return self.label 

# SIGNALS

@receiver(post_save, sender = User)
def create_proifle(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(
            user = instance,
        )



