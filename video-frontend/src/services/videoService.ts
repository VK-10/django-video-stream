import  apiFetch  from "./client";

async function getVideos() {
    const response = await apiFetch("api/videos/")
    const data = await response.json()
    return data;
}

const getVideoById = async(id:string) => {
    return await apiFetch(`api/videos/${id}`)
    .then(response => response.json())
}


export { getVideoById, getVideos };