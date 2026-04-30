import { Client } from "@stomp/stompjs";

const API_BASE_URL = "http://localhost:8080";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

export function subscribeTaskComments(taskId, onCommentReceived) {
    if (!taskId || typeof onCommentReceived !== "function") {
        return () => {};
    }

    const token = localStorage.getItem("token");
    if (!token) {
        return () => {};
    }

    const client = new Client({
        brokerURL: `${WS_BASE_URL}/ws`,
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        debug: () => {},
    });

    let subscription = null;

    client.onConnect = () => {
        subscription = client.subscribe(
            `/topic/tasks/${taskId}/comments`,
            (message) => {
                if (!message?.body) return;
                try {
                    const parsed = JSON.parse(message.body);
                    onCommentReceived(parsed);
                } catch {
                    // Ignore malformed payloads without crashing UI.
                }
            }
        );
    };

    client.activate();

    return () => {
        try {
            subscription?.unsubscribe();
        } finally {
            client.deactivate();
        }
    };
}
