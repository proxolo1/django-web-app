import os.path

from django import forms
from ..models import PhotoacousticFile


class PhotoacousticFileFrom(forms.ModelForm):
    class Meta:
        model = PhotoacousticFile
        fields = ("file_name", "file")

    def clean_file(self):
        file = self.cleaned_data.get("file", False)
        if file:
            # Get the file extension
            # TODO: get the file extension from file.name
            file_extension = os.path.splitext(file.name)[1].lower()
            # Define the allowed extension(s)
            # TODO: set here the allowed file extension
            valid_extensions = [".csv",".txt"]
            if file_extension not in valid_extensions:
                raise forms.ValidationError("Uploaded file has unsupported extension!")

        return file
