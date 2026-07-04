import { io } from "socket.io-client";
import { ASSET_BASE } from "./client.js";

const LISTENERS_UPDATED_EVENT = "listeners-updated";

const SOCKET_URL = ASSET_BASE;
export const socket = io(SOCKET_URL, {
    transports: ["polling", "websocket"],
    autoConnect: true,
});

socket.on(LISTENERS_UPDATED_EVENT, (data) => {
    console.log("Socket received: ", data);
    const customEvent = new CustomEvent(`pt:${LISTENERS_UPDATED_EVENT}`, {detail: data});
    window.dispatchEvent(customEvent);
});