import type { Video } from "../models/vid-model";
import apiFetch  from "./client";

async function getVideos() : Promise<Video[]>{
    const response = await apiFetch("/api/videos/")
    let data;
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch videos");
    }
    console.log("API RESPONSE:", data);
    return data;
}

const getVideoById = async(id:string) : Promise<Video> => {
    const response = await apiFetch(`/api/videos/${id}`);
    let data;
    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch video");
    }

    return data;
}


export { getVideoById, getVideos };