from api.models import MyModel
from workers.utils import ffmpeg_command
from django.template.defaultfilters import time
from celery.bin.graph import workers
from celery.bin.worker import worker
# from django_shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import time
import subprocess
import os

# Create your views here.

# @csrf_exempt
def process(vid_id,video_path, output_path):

    # start = time.time()
    # result1 = subprocess.run(ffmpeg_command("144p", video_path,output_path), capture_output=True, text=True)
    # print(result1.stderr)
    # result2 = subprocess.run(ffmpeg_command("360p", video_path,output_path), capture_output=True, text=True)
    # print(result2.stderr)
    # result3 = subprocess.run(ffmpeg_command("360p", video_path,output_path), capture_output=True, text=True)
    # print(result3.stderr)

    # print(f"Total time: {end - start:.2f} seconds")

    instance = MyModel.objects.get(id = vid_id)

    print("[FFMPEG] Starting processing...")
    print("----"*10)
    instance.status = "PROCESSING"
    instance.save()

    os.makedirs(output_path, exist_ok=True)

    start = time.time()

    result = subprocess.run(ffmpeg_command("multi", video_path,output_path), capture_output=True, text=True)
    # print(result.stderr)

    end = time.time()

    print(f"Total time: {end - start:.2f} seconds")

    if result.returncode != 0:
        instance.status = "FAILED"
        instance.save()
        return

    instance.status = "READY"
    instance.hls_path = f"{output_path}/index.m3u8"
    instance.save()

    print(f"[SUCCESS] video_id={vid_id} processed")
    print(f"[HLS] Path: {output_path}")
    print("----"*10)
    print(f"[TASK END] video_id={vid_id}")



