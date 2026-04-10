from __future__ import absolute_import, unicode_literals
from setuptools import namespaces
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'vsite.settings')

app = Celery('vsite')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.update(
    broker_url='amqp://guest:guest@localhost:5672//',
    task_routes={
        'workers.tasks.process_video': {'queue': 'video-queue'},
    },
)