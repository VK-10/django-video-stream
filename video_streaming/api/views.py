from api.serializers import ApiSerializer
from workers.tasks import process_video
from importlib.resources import path
import uuid
from uuid import uuid4
from django.shortcuts import render


# Create your views here.
from django.http import JsonResponse


from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework.response import Response
from rest_framework.views import APIView




class VideoView(APIView):
    ""
    parser_classes = [MultiPartParser, FormParser]

    # request.data -> Query-dict which likely include all the form parameters
    #  request.files -> will be a Query dict containing all the form files

    def post(self, request, format=None):

        # print(request.content_type)
        # print(request.data)
        # print(request.FILES)
        # print("--------"*10)
        # print(self.parser_classes)
        if request.method == 'POST':
            
            print("DATA:", request.data)
            print("FILES:", request.FILES)
            serializer = ApiSerializer(data=request.data)

            if serializer.is_valid():
                instance = serializer.save()
                print("AFTER SAVE:", instance.video)
                file = instance.video   
                unique_id = str(instance.id)
                
                # file_path = instance.video.path
                # # ext = os.path.splitext(file.name)[1]

                # title = instance.title
                # thumbnail = instance.thumbnail
                # unique_name = f"{title}{unique_id}{file_path}"
                # output_path = f"./uploads/vids/{unique_id}"
                # video_path = f"{output_path}/{unique_name}"

                

                process_video.delay(instance.id)

                return Response({'message': 'uploaded'})

        return Response(serializer.errors, status=400)



# @csrf_exempt
# def upload(request):
    
#     if request.method == 'POST':
#         file = request.data['file']
#         ext = os.path.splitext(file.name)[1]
#         unique_id = str(uuid.uuid4())
#         unique_name = f"{unique_id}{ext}"
#         output_path = f"./uploads/vids/{unique_id}"
#         video_path = f"{output_path}/{unique_name}"
#         hls_path = f"{output_path}/index.m3u8"

    
#         os.makedirs(output_path, exist_ok=True)

#         # run ffmpeg by sending it to the wroker via rabbitmq
#         with open(video_path, 'wb') as f:
#             for chunk in file.chunks():
#                 f.write(chunk)
        

        

#         # if result.returncode != 0:
#         #     print("ffmpeg error:", result.stderr)

#         print("output path", output_path)

#         # const videoUrl = f"http://localhost:8080/upload/vids/${}"
#         return JsonResponse({'message': 'uploaded', 'hls_path': hls_path})

def display(request):
    if request.method == 'GET':
        return JsonResponse({
            "text": "hello"
        })