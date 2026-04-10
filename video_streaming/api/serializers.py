from rest_framework import serializers
from api.models import MyModel

class ApiSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = '__all__'
        # fields = (
        #     'id',
        #     'name', 
        #     'thumbnail', 
        #     'title', 
        #     'video'
        #     'status',
        #     'hls_path', 
        #     'created_at'
        # )