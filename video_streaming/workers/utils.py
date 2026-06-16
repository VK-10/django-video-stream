def ffmpeg_command (quality_string, video_path, output_path, gpu_backend=None) :
    """
    gpu_backend options:
    None,
    "opencl",
    "nvenc",
    "vaapi"
    """
    def get_hw_init(backend):
        if backend == "opencl":
            return ['-init_hw_device', 'opencl=gpu:0,0', '-filter_hw_device', 'gpu']
        elif backend == "nvenc":
             return ['-hwaccel', 'cuda', '-hwaccel_output_format', 'cuda']
        elif backend == "vaapi":
            return ['-hwaccel', 'vaapi',
                    '-hwaccel_device', '/dev/dri/renderD128',
                    '-hwaccel_output_format', 'vaapi']
        elif backend == "qsv":
            return ['-hwaccel', 'qsv', '-hwaccel_output_format', 'qsv']
        return []

    # scaling filter 
    def get_scale_filter(height, backend):
        if backend == "opencl":
            return f'hwupload,scale_opencl=-2:{height},hwdownload,format=yuv420p'
        elif backend == "nvenc":
            return f'scale_cuda=-2:{height}'
        elif backend == "vaapi":
            return f'hwupload,scale_vaapi=-2:{height}'
        elif backend == "qsv":
            return f'scale_qsv=-2:{height}'
        return f'scale=-2:{height}'

    def get_video_encoder(stream_index, bitrate, backend):
        encoder = {
            "nvenc": "h264_nvenc",
            "vaapi": "h264_vaapi",
            "qsv":   "h264_qsv", 
        }.get(backend, "libx264")  # default to libx264 for CPU or opencl

        flags = [f'-c:v:{stream_index}', encoder, f'-b:v:{stream_index}', bitrate]

        if backend == "nvenc":
            flags += [f'-preset:v:{stream_index}', 'p4',
                      f'-rc:v:{stream_index}',     'vbr',
                      f'-cq:v:{stream_index}',     '23']
        elif backend == "vaapi":
            flags += [f'-global_quality:v:{stream_index}', '23']
        else:
            flags += [f'-preset:v:{stream_index}', 'fast']

        return flags

    hw_init = get_hw_init(gpu_backend)
    hls_common = ['-hls_time', '10', '-hls_playlist_type', 'vod']

    PROFILES = {
        "144p": (144, '200k',  '64k'),
        "360p": (360, '800k',  '96k'),
        "720p": (720, '2500k', '128k'),
    }

    if quality_string in PROFILES:
        height, vbr, abr = PROFILES[quality_string]

        return [
            'ffmpeg', *hw_init,
            '-i', video_path,
            '-vf', get_scale_filter(height, gpu_backend),
            *get_video_encoder(0, vbr, gpu_backend),
            '-c:a', 'aac', '-b:a', abr,   # audio: AAC codec, fixed bitrate
            *hls_common,
            '-hls_segment_filename', f'{output_path}/{quality_string}_segment%03d.ts',
            '-start_number', '0',
            f'{output_path}/{quality_string}.m3u8'
        ]

    elif quality_string == "multi":

        if gpu_backend == "opencl":
            # Upload once → split on GPU → scale each → download each
            filter_complex = (
                '[0:v]hwupload[vgpu];'
                '[vgpu]split=3[v1][v2][v3];'
                '[v1]scale_opencl=-2:144,hwdownload,format=yuv420p[v1out];'
                '[v2]scale_opencl=-2:360,hwdownload,format=yuv420p[v2out];'
                '[v3]scale_opencl=-2:720,hwdownload,format=yuv420p[v3out]'
            )
        elif gpu_backend == "nvenc":
            # Frames already in CUDA memory, split and scale stay on GPU
            filter_complex = (
                '[0:v]split=3[v1][v2][v3];'
                '[v1]scale_cuda=-2:144[v1out];'
                '[v2]scale_cuda=-2:360[v2out];'
                '[v3]scale_cuda=-2:720[v3out]'
            )
        elif gpu_backend == "vaapi":
            filter_complex = (
                '[0:v]hwupload[vgpu];'
                '[vgpu]split=3[v1][v2][v3];'
                '[v1]scale_vaapi=-2:144[v1out];'
                '[v2]scale_vaapi=-2:360[v2out];'
                '[v3]scale_vaapi=-2:720[v3out]'
            )
        elif gpu_backend == "qsv":                    
            filter_complex = (
                '[0:v]split=3[v1][v2][v3];'
                '[v1]scale_qsv=-2:144[v1out];'
                '[v2]scale_qsv=-2:360[v2out];'
                '[v3]scale_qsv=-2:720[v3out]'
            )
        else:  # CPU
            filter_complex = (
                '[0:v]split=3[v1][v2][v3];'
                '[v1]scale=-2:144[v1out];'
                '[v2]scale=-2:360[v2out];'
                '[v3]scale=-2:720[v3out]'
            )

        cmd = ['ffmpeg', *hw_init, '-i', video_path,
               '-filter_complex', filter_complex]

        stream_specs = [
            ('[v1out]', '200k',  '64k'),   # 144p
            ('[v2out]', '800k',  '96k'),   # 360p
            ('[v3out]', '2500k', '128k'),  # 720p
        ]
        for idx, (vmap, vbr, abr) in enumerate(stream_specs):
            cmd += ['-map', vmap, '-map', '0:a']
            cmd += get_video_encoder(idx, vbr, gpu_backend)
            cmd += [f'-c:a:{idx}', 'aac', f'-b:a:{idx}', abr]

        cmd += [
            '-f', 'hls',
            *hls_common,
            # v:0,a:0 → stream 0 video + stream 0 audio = 144p
            # v:1,a:1 → stream 1 video + stream 1 audio = 360p  etc.
            '-var_stream_map',       'v:0,a:0 v:1,a:1 v:2,a:2',
            '-hls_segment_filename', f'{output_path}/%v_segment%03d.ts',
            '-master_pl_name',       'master.m3u8',
            f'{output_path}/%v.m3u8'
        ]
        return cmd

    raise ValueError(f"Unknown quality_string: '{quality_string}'")
