// types.ts
export type SocketProps = {
    sendJsonMessage: (message: any) => void;
    lastJsonMessage: any;
};

export type ChatMessage = {
    username: string;
    message: string;
};

export type PlaylistItem = {
    video_id: string;
    title: string;
};