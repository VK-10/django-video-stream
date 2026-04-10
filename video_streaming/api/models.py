from http.client import PROCESSING
from django.db import models

# Create your models here.
import uuid


class MyModel(models.Model):

    class Status(models.TextChoices):
        UPLOADED = "uploaded"
        PROCESSING = "processing"
        READY = "ready"
        FAILED = "failed"



    id = models.UUIDField(primary_key=True, default= uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='thumbnails/', null = True, blank = True)
    title = models.CharField(max_length=255, default = "Untitled")
    video = models.FileField(upload_to='videos/', null = True, blank=True)
    status = models.CharField(
        max_length=20,
        choices = Status.choices,
        default = Status.UPLOADED
    )

    hls_path = models.CharField(max_length=500, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    