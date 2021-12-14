import React from "react";
import cards from "./cardListFull";
import { useState, useEffect } from "react";
import { socket } from "./socket";

export default function Cards() {
    const [cardQuestion, setCardQuestion] = useState("");

    useEffect(() => {
        socket.on("chooser", (chooser) => {
            setCardQuestion(chooser);
        });

        socket.on("selectCard", (chooser) => {
            setCardQuestion(chooser);
            // socket.emit();
        });
    });

    const nextGame = function () {
        //if user confirms then socket.emit
        confirm("Next round?");
        if (confirm) {
            socket.emit(nextGame);
        }
    };

    return (
        <>
            <h1>Fill in the missing word: {cardQuestion}</h1>
            <button onClick={() => nextGame()}>Next game</button>
        </>
    );
}
