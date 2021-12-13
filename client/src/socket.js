import { io } from "socket.io-client";

const socket = io();



socket.on("welcome", function (data) {
    console.log("data🦧", data);
    socket.emit("thanks", {
        message: "Thank you. It is great to be here.",
    });
});

socket.on("userCount", function (data) {
    console.log("data", data);
    socket.emit("userCount", {
        newUserMessage: `Hey everyone, the user with the id ${socket.id} just joined us!`,
    });
});
