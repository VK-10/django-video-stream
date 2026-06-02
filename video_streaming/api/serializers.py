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

class VideoResponseSerializer(serializers.ModelSerializer):
    manifest_url = serializers.SerializerMethodField()

    class Meta:
        model = MyModel
        fields = [
            "id",
            "title",
            "thumbnail",
            "status",
            "manifest_url",
            "created_at",
        ]

    def get_manifest_url(self, obj):
        request = self.context.get("request")

        if obj.hls_path:
            if request:
                return request.build_absolute_uri(obj.hls_path)
            return obj.hls_path

        return None