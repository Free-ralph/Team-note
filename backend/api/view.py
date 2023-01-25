from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from .serializers import( 
    NoteSerializer, TeamGetSerializer, TeamPostSerializer, TagSerializer 
    )
from rest_framework import status
from backend.models import Note, Profile, Team, Tag
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist

class NoteListApiView(GenericAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, ]

    def get(self, request, *args, **kwargs):
        notes = Note.objects.filter(profile__user__id = request.user.id)
        return Response(self.get_serializer(notes, many = True).data)

class NoteApiView(GenericAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, ]
    def get(self, request, *args, **kwargs):
        noteID = kwargs['note_id']
        try:
            note = Note.objects.get(id = noteID)
        except:
            return Response({'message' : "note doesn't exist"} , status= status.HTTP_404_NOT_FOUND)
        
        return Response(self.get_serializer(note).data)
        


    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            title = serializer.validated_data['title']
            markdown = serializer.validated_data['markdown']
            tags = serializer.validated_data['tags']
            try:
                profile = Profile.objects.get(user__id = request.user.id)
            except:
                return Response({"message" : "something went wrong"}, status = status.HTTP_404_NOT_FOUND)
            note = Note.objects.create(
                title = title, 
                markdown = markdown,
                profile = profile
            )
            for tag in tags:
                if tag['id']:
                    tag = Tag.objects.get(id = int(tag["id"]))
                else:
                    tag = Tag.objects.create(label = tag["label"])
                note.tags.add(tag)
            
            note.save()
            return Response({'message' : 'note added successfully'})
        return Response(serializer.errors,  status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        noteID = kwargs['note_id']
        try:
            note = Note.objects.get(id = noteID)
        except:
            return Response({'message' : "note doesn't exist"} , status= status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response(self.get_serializer(note).data)



class TeamApiView(GenericAPIView):
    serializer_class = TeamPostSerializer
    permission_classes = [IsAuthenticated, ]
    
    def get(self, request, *args, **kwargs):
        teamID = kwargs['team_id']
        try:
            team = Team.objects.get(refID = teamID)
        except:
            return Response({"message" : "team doesn't exist"}, status=status.HTTP_404_NOT_FOUND)
        return Response(TeamGetSerializer(team, context = {"request" : request}).data)

        

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            errors = {'members' : {}}
            name = serializer.validated_data['name']
            about = serializer.validated_data['about']
            rules = serializer.validated_data['rules']
            members = serializer.validated_data['members']
            team = Team.objects.create(
                name  = name, 
                about = about, 
                rules = rules
            )
            team.members.add(request.user.profile)
            for index, member in enumerate(members):
                try:
                    profile = Profile.objects.get(profile_id = member['profile_id'])
                    team.members.add(profile)
                except ObjectDoesNotExist:
                    errors['members'][index] = "profile with this ID doesn't exist"
            
            if errors['members']:
                team.delete()
                return Response(errors, status=status.HTTP_400_BAD_REQUEST)
            
            team.save()
            return Response({'message' : 'note added successfuly'})
        
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class TagApiView(GenericAPIView):
    serializer_class = TagSerializer 
    permission_classes = [IsAuthenticated]
    
    def get(self, *args, **kwargs):
        tags = Tag.objects.all()
        return Response(self.get_serializer(tags, many = True).data)
        
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message' : "tag added successfuly "})
        print(serializer.errors, "these are the errors")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, *args, **kwargs):
        tagID = kwargs['tag_id']
        try:
            tag = Tag.objects.get(id = tagID)
        except:
            return Response({"message" : "tag not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(tag).data)