from api.models import MyModel
from celery import shared_task
from workers.views import process

@shared_task
def process_video(vid_id):
    instance = MyModel.objects.get(id=vid_id)
    print(f"[DB FETCH] Found video ID={vid_id}")
    video_path = instance.video.path
    output_path = f"./uploads/vids/{vid_id}"
    print(f"[FILE] Input path: {video_path}")

    print("--"*15)
    print(f"[TASK START] Processing video_id={vid_id}")
    print("--"*15)
    print("//"*10)

    process(vid_id,video_path, output_path)

    instance.status = "PROCESSED"
    instance.hls_path = f"{output_path}/index.m3u8"
    instance.save()
