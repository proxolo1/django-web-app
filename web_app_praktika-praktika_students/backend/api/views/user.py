from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator

from ..serializer import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


# TODO: Set the api_view
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteUser(request):
    # TODO: Get User from request
    user = request.user
    try:
        # TODO: Delete User
        user.delete()
        # TODO: Return a statuscode 200
        return Response({"message": "User deleted successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        # TODO: Return a error message with the statuscode 500
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# TODO: Set the api_view
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def changePassword(request):
    user = request.user
    data = request.data
    try:
        # TODO: Check if the old password is correct
        print(data.get("old_password", ""))
        if not user.check_password(data.get("old_password", "")):
            # TODO: Return a error message with the statuscode 400
            return Response({"error": "Old password is incorrect."}, status=400)

        # TODO: Check if the new password and the confirm password is the same
        if data.get("old_password") == data.get("new_password"):
            # TODO: Return a error message with the statuscode 400
            return Response({"error": "New password must be different from old password."}, status=400)

        # TODO: Check if the new password and the old password are different
        if data.get("old_password") == data.get("new_password"):
            # TODO: Return a error message with the statuscode 400
            return Response({"error": "New password must be different from old password."}, status=400)

        try:
            # TODO: Check if the new passwart is valide
            validate_password(data["new_password"], user=user)
        except ValidationError as e:
            # TODO: Return a error message with the statuscode 400
            return Response({"error": str(e)}, status=400)

        user.set_password(data["new_password"])
        user.save()

        # TODO: Return a message, that the change was successfully with the statuscode 200
        return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        # TODO: Return a error message with the statuscode 500
        return Response({"error": str(e)})


# TODO: Set the api_view
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserInfo(request):
    user = request.user
    # TODO: Set the information to the info dict
    info = {"username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser}
    return Response(info, status=status.HTTP_200_OK)


# TODO: Set the api_view
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def setUserInfo(request):
    user = request.user
    print(request.data)
    # TODO: Check if 'email' is in the request data
    if "email" in request.data:
        validator = EmailValidator()
        try:
            validator(request.data["email"])
        except ValidationError:
            return Response(data="Insert a valid E-Mail Address", status=status.HTTP_400_BAD_REQUEST)

        # TODO: Check if the email already exist
        if User.objects.exclude(pk=user.pk).filter(email=request.data["email"]).exists():
            return Response(data="E-Mail Address is already in use, insert a other one.",
                    status=status.HTTP_400_BAD_REQUEST)
    try:
        # This set the new values to the database
        for filed, value in request.data.items():
            if hasattr(user, filed):
                setattr(user, filed, value)
        # Here the new data will be saved
        user.save()
        return Response({"message": "User information changed successfully."}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response(data=e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
