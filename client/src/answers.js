import React from "react";
import cards from "./cardListFull";
import { useState, useEffect } from "react";
import Answer from "./answer";
import { io } from "socket.io-client";
const socket = io();

export default function Answers({currentUser}) {
    //for selecting 5 cards messages
    const [cardAnswers, setCardAnswers] = useState([]);
    //sets state of a single card that was clicked
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((messages) => [...messages, message]);
            console.log("🐹", messages);
        });
    }, []);

    useEffect(() => {
        socket.emit("send", message);
    }, [message]);

    const submit = async (e) => {
        setMessage(e);
        // socket.emit("send", message);
        console.log("e", message);
    };

    function selectRandom(array) {
        var copy = array[0].white.slice(0);
        return function () {
            if (copy.length < 1) {
                // console.log("we are hee");
                copy = array[0].white.slice(0);
            }
            const array = [];
            for (let i = 0; i < 5; i++) {
                var index = Math.floor(Math.random() * copy.length);
                var item = copy[index]["text"];
                copy.splice(index, 1);
                array.push(item);
            }

            setCardAnswers(array);
            return console.log(cardAnswers);
        };
    }

    var chooser = selectRandom(cards);

    function addOne() {
        var copy = cards[0].white.slice(0);
        // console.log("copy", copy);
        return function () {
            // console.log("we are here");
            var index = Math.floor(Math.random() * copy.length);
            var item = copy[index];
            copy.splice(index, 1);
            // console.log("🍀", item.text);
            return item.text;
        };
    }

    const changedText = addOne(cards);

    function handleClick(i) {
        const newArray = [];
        cardAnswers.map((answer, index) => {
            if (index !== parseInt(i)) {
                newArray.push(answer);
            } else {
                newArray.push(changedText());
            }
            return setCardAnswers(newArray);
        });

        // console.log("new array", newArray);
    }

    return (
        <div>
            <div className="playGround">
                <div id="messages">
                    {console.log(" 🐈", messages)}
                    {messages.map(({ text }, index) => (
                        <div key={index}>
                            <div>{text}</div>
                        </div>
                    ))}
                </div>
            </div>

            {cardAnswers.map((answer, index) => (
                <Answer
                    key={answer + index}
                    answer={answer}
                    index={index}
                    changedText={handleClick}
                    submit={submit}
                    setMessage={setMessage}
                    message={message}
                />
            ))}
            <button onClick={chooser}>Click me</button>
        </div>
    );
}
