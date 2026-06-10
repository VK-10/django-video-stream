from django.urls import path

from .consumer import WatchPartyConsumer

websocket_urlpatterns = [
    path('ws/room/<uuid:room>', WatchPartyConsumer.as_asgi()),

]