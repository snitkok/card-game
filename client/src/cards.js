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
            console.log("selecting card");
        });
    });

    const nextGame = function () {
        confirm("Next round?");
        if (confirm) {
            socket.emit("nextGame");
        }
    };

    return (
        <div>
            <div className="cards flip-card">
                <div className="cardsContent flip-card-inner">
                    <div className="flip-card-front">
                        <h1>Complete the sentence</h1>
                        <hr />
                        <h2>{cardQuestion}</h2>
                        <br />
                    </div>
                    <div className="flip-card-back">
                        <img src="./horrible.gif" className="cardsBack" />
                    </div>
                </div>
            </div>
            {/* <div>
                <button onClick={() => nextGame()}>Next game</button>
            </div> */}
        </div>
    );
}
