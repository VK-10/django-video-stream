import * as WS from "react-use-websocket";

// console.log(WS.default.default);
// console.log(typeof WS.default.default);


const useWebSocket = WS.default.default;

// interface WebSocketMessage {
//     data: {};
//     username: string;
//     action: string;
// }

const useWatchPartySocket = (roomId:string) => {
    const socketUrl =`ws://localhost:8000/ws/room/${roomId}`;
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket (
        socketUrl,
        {
            onOpen: () => console.log("WebSocket connection established"),
            onClose: () => console.log("WebSocket connection closed"),
            onError: (error) => {
                console.error("WebSocket error:", error);
            },
            shouldReconnect: () => true, // Automatically reconnect
        }
    );


    // const send = (message: {type: string; content: string}) => {
    //     sendJsonMessage(message); // sending event to server
    // };

    return {
        sendJsonMessage,
        readyState,
        lastJsonMessage
    };
};

export default useWatchPartySocket;

// export useWatchpartySocket(roomId: string) {
//     // const controllerRef = useRef

//     const connect = () => {

//     }
//     const disconnect = () => {
        
//     }
//     const send meesages = () => {
        
//     }
//     const recieve = () => {
        
//     }
//     const reconnect = () => {

//     }
// }