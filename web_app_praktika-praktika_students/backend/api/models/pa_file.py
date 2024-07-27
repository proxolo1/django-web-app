from django.db import models
from django.contrib.auth.models import User
from datetime import datetime


def user_directory_pa_file(instance, filename):
    data = datetime.now()
    # TODO: set the path to 'user_{user id}/photoacoustic/{current date and time}_{file name}
    return f"user_{instance.user.id}/photoacoustic/{data}_{filename}"


class PhotoacousticFile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # TODO: Create a CharField with max_length=50 and it should be unique
    file_name = models.CharField(max_length=50, unique=True)
    # TODO: Create a FileField and use the function 'user_directory_pa_file' for the storage path
    file = models.FileField(upload_to=user_directory_pa_file)
    # TODO: Create a DateTimeField and set the upload time automatically
    upload_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file_name
