def ffmpeg_command (quality_string, video_path, output_path) :
    if quality_string == "144p":
            return [
            'ffmpeg', '-i', video_path,
            '-vf', 'scale=-2:144',
            '-codec:v', 'libx264', '-b:v', '200k',
            '-codec:a', 'aac', '-b:a', '64k',
            '-hls_time', '10',
            '-hls_playlist_type', 'vod',
            '-hls_segment_filename', f'{output_path}/144p_segment%03d.ts',
            '-start_number', '0',
            f'{output_path}/144p.m3u8'
]
        
        #  ffmpeg -i input.mp4 \
        # -vf "scale=-2:144" \
        # -c:v libx264 -b:v 200k \
        # -c:a aac -b:a 64k \
        # -hls_time 10 \
        # -hls_playlist_type vod \
        # -hls_segment_filename "144p_%03d.ts" \
        # 144p.m3u8

    elif quality_string == "360p":
        [
    'ffmpeg', '-i', video_path,
    '-vf', 'scale=-2:360',
    '-codec:v', 'libx264', '-b:v', '800k',
    '-codec:a', 'aac', '-b:a', '96k',
    '-hls_time', '10',
    '-hls_playlist_type', 'vod',
    '-hls_segment_filename', f'{output_path}/360p_segment%03d.ts',
    '-start_number', '0',
    f'{output_path}/360p.m3u8'
]
    
    elif quality_string == "720p":
        [
    'ffmpeg', '-i', video_path,
    '-vf', 'scale=-2:720',
    '-codec:v', 'libx264', '-b:v', '2500k',
    '-codec:a', 'aac', '-b:a', '128k',
    '-hls_time', '10',
    '-hls_playlist_type', 'vod',
    '-hls_segment_filename', f'{output_path}/720p_segment%03d.ts',
    '-start_number', '0',
    f'{output_path}/720p.m3u8'
]

    elif quality_string == "multi":
        return  [
    'ffmpeg', '-i', video_path,

    # Split video into 3 streams
    '-filter_complex',
    '[0:v]split=3[v1][v2][v3];'
    '[v1]scale=-2:144[v1out];'
    '[v2]scale=-2:360[v2out];'
    '[v3]scale=-2:720[v3out]',

    # 144p
    '-map', '[v1out]', '-map', '0:a',
    '-c:v:0', 'libx264', '-b:v:0', '200k',
    '-c:a:0', 'aac', '-b:a:0', '64k',

    # 360p
    '-map', '[v2out]', '-map', '0:a',
    '-c:v:1', 'libx264', '-b:v:1', '800k',
    '-c:a:1', 'aac', '-b:a:1', '96k',

    # 720p
    '-map', '[v3out]', '-map', '0:a',
    '-c:v:2', 'libx264', '-b:v:2', '2500k',
    '-c:a:2', 'aac', '-b:a:2', '128k',

    # HLS settings
    '-f', 'hls',
    '-hls_time', '10',
    '-hls_playlist_type', 'vod',

    # Variant streams
    '-var_stream_map',
    'v:0,a:0 v:1,a:1 v:2,a:2',

    # Output naming
    '-hls_segment_filename',
    f'{output_path}/%v_segment%03d.ts',

    # Master + variant playlists
    '-master_pl_name', 'master.m3u8',
    f'{output_path}/%v.m3u8'
]
