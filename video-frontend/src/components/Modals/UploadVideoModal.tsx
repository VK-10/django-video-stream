import { useState, useRef, useEffect } from "react";
import { tokenStorage } from "../../storage/tokenStorage";

type props = {
    isOpen : boolean;
    onClose: () => void;
}

const UploadVideoModal = ({isOpen, onClose }: props) => {
    const [videoFile, setVideoFile] = useState<File | null> (null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null> (null);
    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const resetModal = () => {
        setVideoFile(null);
        setThumbnailFile(null);
        setTitle("");
        setName("");
    }

    const handleClose = () => {
        resetModal();
        onClose();
    }

    const uploadVideo = async () => {
        if (!videoFile || !thumbnailFile || !title || !name) {
            alert("All fields are required");
            return;
        }

        try{
            setLoading(true);

            const formdata = new FormData();
            formdata.append("video", videoFile)
            formdata.append("thumbnail", thumbnailFile)
            formdata.append("title", title)
            formdata.append("name", name)

            const res = await fetch("http://localhost:8000/post/", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tokenStorage.getAccessToken()}`,
                },
                body: formdata,
            });

            if (!res.ok) throw new Error("Upload failed");

            alert("Video uploaded successfully");
            handleClose();
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }


    };


    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
                 <h2 className="text-lg font-semibold">Upload Video</h2>

                 {/* Title */}
                    <input
                    type="text"
                    placeholder="Video title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border p-2 rounded"
                    />
                {/* Name */}
                    <input 
                    type = "text"
                    placeholder= "Channel name"
                    value= {name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-2 rounded"
                    />
                {/* Video */}
                    <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                    />
                 {/* Thumbnail */}
                    <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                    />
                {/* Actions */}
                    <div className="flex justify-end gap-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={uploadVideo}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                    </div>
            </div>
      </div>
    )

}

export default UploadVideoModal;