import { io } from "socket.io-client";
import { ASSET_BASE } from "./client.js";

const SOCKET_URL = ASSET_BASE;
export const socket = io(SOCKET_URL, {
    transports: ["polling", "websocket"],
    autoConnect: true,
});

socket.on("listeners-updated", (data) => {
    console.log("Socket received: ", data);
    const customEvent = new CustomEvent("pt:listeners-updated", {detail: data});
    window.dispatchEvent(customEvent);
});