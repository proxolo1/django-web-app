from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from ..forms import PhotoacousticFileFrom
from ..models import PhotoacousticFile
from ..serializer import PhotoacousticFileSerializer

from ..utils.read_fir_csv import getHeartrate


# TODO: Set the api_view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uploadPhotoacousticFile(request):
    try:
        print(request.FILES)
        form = PhotoacousticFileFrom(request.POST, request.FILES)
        if form.is_valid():
            file = form.save(commit=False)
            # TODO: Set here the user from the request
            file.user = request.user 
            file.save()
            return Response({"message": "File saved!"}, status=status.HTTP_200_OK)
        # TODO: Send a response with the error from form to the frontend with the status 400
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# TODO: Set the api_view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserPhotoacousticFiles(request):
    user = request.user
    try:
        files = PhotoacousticFile.objects.all().filter(user=user)
        files_serialized = PhotoacousticFileSerializer(files, many=True)
        return Response({"files": files_serialized.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# TODO: Set the api_view
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deletePhotoacousticFile(request):
    try:
        # TODO: Get the file with the file id from the request
        file = PhotoacousticFile.objects.get(id=request.data.get('file_id'), user = request.user)
        file.delete()
        return Response({"message": "File deleted!"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# TODO: Set the api_view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calculateHeartrate(request):
    try:
        # TODO: Get the file with the file id from the request data
        file = PhotoacousticFile.objects.get(id=request.data.get('file_id'), user = request.user)
        # TODO: Calculate the heartrate an give the function the path to the .csv file and the sampling frequency from
        # the request data
        heartrate = getHeartrate(file.file.path, request.data.get('sampling_frequency'))
        # TODO: Send the heartrate with the status code 200 to the frontend
        return Response({"heartrate": heartrate}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
