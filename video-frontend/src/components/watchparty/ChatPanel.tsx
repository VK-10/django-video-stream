import { useEffect, useState } from "react";
import { type SocketProps, type ChatMessage } from "./type"

export default function ChatPanel({
    sendJsonMessage,
    lastJsonMessage,
}: SocketProps) {
    const [messages, setMessages] =
        useState<ChatMessage[]>([]);

    const [text, setText] = useState("");

    useEffect(() => {
        if (!lastJsonMessage) return;

        if (
            lastJsonMessage.action ===
            "chat_message"
        ) {
            setMessages(prev => [
                ...prev,
                {
                    username:
                        lastJsonMessage.username,
                    message:
                        lastJsonMessage.message,
                },
            ]);
        }
    }, [lastJsonMessage]);

    const handleSend = () => {
        if (!text.trim()) return;

        sendJsonMessage({
            action: "chat",
            data: {
                message: text,
            },
        });

        setText("");
    };

    return (
        <div>
            <h3>Chat</h3>

            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>
                            {msg.username}
                        </strong>
                        : {msg.message}
                    </div>
                ))}
            </div>

            <input
                value={text}
                onChange={(e) =>
                    setText(e.target.value)
                }
            />

            <button onClick={handleSend}>
                Send
            </button>
        </div>
    );
}