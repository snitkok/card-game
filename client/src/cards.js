import React from "react";
import cards from "./cardListFull";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io();

export default function Cards() {
    const [cardQuestion, setCardQuestion] = useState("");

    // useEffect(() => {
    //     socket.on("connect", () => {
    //         socket.emit("cardQuestion", cardQuestion);
    //     });

    //     socket.on("startGame", (card) => {
    //         setCardQuestion(card);
    //     });

    //     socket.on("connected", (user) => {
    //         setUsers((users) => [...users, user]);
    //     });

    //     socket.on("disconnected", (id) => {
    //         setUsers((users) => {
    //             return users.filter((user) => user.id !== id);
    //         });
    //     });
    // }, []);

    // function selectRandom(array) {
    //     var copy = array[0].black.slice(0);
    //     return function () {
    //         if (copy.length < 1) {
    //             console.log("we are hee");
    //             copy = array[0].black.slice(0);
    //         }
    //         var index = Math.floor(Math.random() * copy.length);
    //         var item = copy[index];
    //         copy.splice(index, 1);
    //         setCardQuestion(item.text);
    //         return console.log(cardQuestion);
    //     };
    // }

    // var chooser = selectRandom(cards);

    return (
        <>
            <h1>{cardQuestion}</h1>
            {/* <button onClick={chooser}>Click me</button> */}
        </>
    );
}
