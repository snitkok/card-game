import { io } from "socket.io-client";

export let socket;

socket = io();

socket.on("welcome", function (data) {
    console.log(data);
    socket.emit("thanks", {
        message: "Thank you. It is great to be here.",
    });
});
