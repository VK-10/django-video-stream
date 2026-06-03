import json
from channels.generic.websocket import AsyncWebcketConsumer
import random
import datetime
import requests

from .room import Room
import asyncio

rooms = {}

class WatchPartyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room']
        self.room_group_name = 'room_%s' % self.room_name
        self.user = self.scope['user']

        if self.room_group_name not in rooms:
            rooms[self.room_group_name] = Room()
            room = rooms[self.room_group_name]
            room.create_room(self.room_group_name)

        else:
            room = rooms[self.room_group_name]

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()



    async def disconnect(self, close_code):

        room = rooms[self.room_group_name]
        room.remove_user(self.user.username)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'notifyUserDisconnect',
                'user_disconnect': self.user.username,
            }
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'userCountSend',
                'action': "user_count",
            }
        )

        await self.send(text_data=json.dumps(room.__dict__))
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )


    #recieve data from websocket user
    async def recieve(self, text_data):
        room = rooms[self.room_group_name]
        text_data_json = json.loads(text_data)

        try:
            data = text_data_json['data']
            action = text_data_json['action']

        except KeyError:
            print("KeyError: 'data' or 'action' not found in the recieved JSON")
            return

        
        async def setUserName(text_data_json):
            username = self.user.username = text_data_json['username'] + "%^%^%^#%^" + str(
                random.randint(0, 1000000)
            )

            if len(room.room_users) == 0:
                room.room_host = username

            room.add_user(username)

            print(room.room_users)

            await self.send(text_data=json.dumps(room.__dict__))
            await self.channel_layer.group_send(
                self.room_group_name, 
                {
                    'type': 'giveTimeSend',
                    'action': "give_time",
                }
            )

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'usersCountSend',
                    'action': "users_count",
                }
            )

        async def messageRecieve(text_data_json):
            message = text_data_json['message']
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'messageSend',
                    'message': message,
                    'username': self.user.username,
                }
            )

        async def NewUserTimeRecieve(text_data_json):
            new_user_time = text_data_json['new_user_time']
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': "newUserTimeSend",
                    'new_user_time': new_user_time,
                }
            )

        async def addToPlaylistRecieve(text_data_json):
            response = requests.get('http://noembed.com/embed?rl=https://www.youtube.com/watch?v=' + data)
            title = response.json()['title']
            room.index += 1
            room.add_to_playlist({"video_id": data, "title":title,  "index": room.index})
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': "addToPlaylistSend",
                    'action': action,
                    'video_id': data,
                    'title': title,
                    'index': room.index,
                    'username': self.user.username,
                }
            )
        
        async def removeFromPlaylistRecieve(text_data_json):
            print("remove from playlist:" + data, data.split("*")[-1])
            room.remove_from_playlist(data, data.split("*")[-1])
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'removeFromPlaylistSend',
                    'action': action,
                    'data': data,
                    'username': self.user.username, 
                }
            )

        async def loadVideoRecieve(text_data_json):
            action  = text_data_json['action']
            data = text_data_json['data']
            room.curr_video(data)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'loadVideoSend',
                    'action': action,
                    'data': data,
                    'username': self.user.username,
                }
            )

        async def playerStateChangeRecieve(text_data_json):
            action = text_data_json['action']
            room = rooms[self.room_group_name]
            if action == "seek":
                data = text_data_json['data']
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'playerStateChangeSend',
                        'action': action,
                        'data': data,
                        'username': self.user.username,
                    }
                )

            else:
                if action == "pause" or action == "play":
                    room.SetPlayerState(action)
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'playerStateChangeSend',
                            'action': action,
                            'username': self.user.username,
                        }
                    )

        recieved = {"username": setUserName, "message": messageRecieve, 
                    "new_user_time": NewUserTimeRecieve, "addToPlaylist": addToPlaylistRecieve, 
                    'removeFromPlaylist': removeFromPlaylistRecieve, 'loadVideo': loadVideoRecieve, 
                    'play': playerStateChangeRecieve, 'pause': playerStateChangeRecieve, "seek": playerStateChangeRecieve}
        
        await recieved.get(text_data_json['info'])(text_data_json)