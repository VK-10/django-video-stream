# Video Streaming Service

A Django-based video streaming backend that accepts video uploads, processes them into adaptive HLS (HTTP Live Streaming) streams using FFmpeg, and serves multiple quality variants (144p, 360p, 720p) via a REST API.

---

## Architecture Overview

```
Client
  │
  ▼
Django REST API  ──►  PostgreSQL (metadata)
  │
  ▼
Celery Worker  ──►  FFmpeg (HLS encoding)
  ▲
  │
RabbitMQ (message broker)
```

**Flow:**
1. Client uploads a video via `POST /uploads/`
2. Django saves the file and creates a DB record
3. A Celery task is dispatched via RabbitMQ
4. The worker processes the video with FFmpeg into multi-quality HLS segments
5. The DB record is updated with the HLS path and status

---

## Features

- **Video Upload** via multipart form data
- **Async Processing** with Celery + RabbitMQ
- **Adaptive Bitrate Streaming** — outputs 144p, 360p, and 720p HLS variants in a single FFmpeg pass
- **Master Playlist** (`master.m3u8`) for ABR-compatible players
- **Status Tracking** — `uploaded → processing → ready / failed`
- **PostgreSQL** for persistent video metadata
- **CORS** support for frontend integration

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Django 5.0 + Django REST Framework |
| Task Queue | Celery |
| Message Broker | RabbitMQ |
| Database | PostgreSQL |
| Video Processing | FFmpeg |
| Media Serving | Django static/media files |

---

## 📦 Installation

### Prerequisites

- Python 3.10+
- PostgreSQL
- RabbitMQ
- FFmpeg installed and available in `PATH`

### 1. Clone the repository

```bash
git clone https://github.com/your-username/video-streaming.git
cd video-streaming
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure the database

Update `vsite/settings.py` with your PostgreSQL credentials:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5433',
    }
}
```

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Start RabbitMQ

```bash
docker-compose up -d
```

### 7. Start the Celery worker

```bash
celery -A vsite worker --loglevel=info -Q video-queue
```

### 8. Run the Django development server

```bash
python manage.py runserver
```

---


**Form fields:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | ✅ | Internal identifier |
| `title` | string | ✅ | Display title |
| `video` | file | ✅ | Video file to upload |
| `thumbnail` | image | ❌ | Optional thumbnail image |

**Success response:**

```json
{
  "message": "uploaded"
}
```

**Error response:**

```json
{
  "field_name": ["error detail"]
}
```


---

## 🎞️ HLS Output Structure

After processing, each video produces:

```
uploads/vids/{video_id}/
├── master.m3u8          # Master playlist (ABR)
├── 0.m3u8              # 144p playlist
├── 1.m3u8              # 360p playlist
├── 2.m3u8              # 720p playlist
├── 0_segment000.ts
├── 0_segment001.ts
├── 1_segment000.ts
...
```

The `master.m3u8` can be fed directly into any HLS-compatible player (e.g., `hls.js`, `Video.js`, native Safari/iOS).

---

## ⚙️ Video Processing Details

FFmpeg encodes all three quality variants in a **single pass** using stream splitting:

| Quality | Resolution | Video Bitrate | Audio Bitrate |
|---|---|---|---|
| 144p | scale=-2:144 | 200k | 64k |
| 360p | scale=-2:360 | 800k | 96k |
| 720p | scale=-2:720 | 2500k | 128k |

- Segment duration: **10 seconds**
- Playlist type: **VOD**
- Codec: **H.264 (libx264)** + **AAC**

---

## 🗃️ Video Model

```python
class MyModel(models.Model):
    id         # UUID primary key
    name       # Internal identifier
    title      # Display title
    video      # Uploaded video file
    thumbnail  # Optional thumbnail
    status     # uploaded | processing | ready | failed
    hls_path   # Path to master.m3u8 after processing
    created_at # Auto timestamp
```

---

## 🔧 Configuration

Key settings in `vsite/settings.py`:

```python
MEDIA_URL = '/uploads/'
MEDIA_ROOT = BASE_DIR / 'uploads'
CELERY_BROKER_URL = 'amqp://guest:guest@localhost:5672//'
CORS_ALLOWED_ORIGINS = ["http://localhost:3000"]
```

---

## Known Issues / TODO

- [ ] Add a `GET /videos/` endpoint to list all videos and their HLS paths
- [ ] Fix `hls_path` — currently saves segment path instead of `master.m3u8` in `tasks.py`
- [ ] Fix missing `return` statements for 360p and 720p in `utils.py`
- [ ] Add thumbnail auto-generation from video
- [ ] Add authentication

---

## 📄 License

MIT
