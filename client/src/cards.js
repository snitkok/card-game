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
        <div className="cards">
          <div className="cardsContent">
                <h1>Fill in the missing word</h1>
                <hr/>
                <h2>{cardQuestion}</h2>
                <br />
                <button onClick={() => nextGame()}>Next game</button>
            </div>
       </div>
    );
}
