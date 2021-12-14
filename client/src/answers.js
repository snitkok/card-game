import React from "react";
import cards from "./cardListFull";
import { useState, useEffect } from "react";
import Answer from "./answer";
import { socket } from "./socket";

export default function Answers({ currentUser }) {
    //for selecting 5 cards messages
    const [cardAnswers, setCardAnswers] = useState([]);
    //sets state of a single card that was clicked
    const [message, setMessage] = useState();

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on("message", (message) => {
            console.log("&&&&&&&&&", message);
            setMessages((messages) => [...messages, message]);
            console.log("🐹", messages);
        });
    }, []);

    useEffect(() => {
        //add check here
        if (typeof message !== "undefined") {
            socket.emit("send", message);
            console.log("message is not null", message);
        } else {
            console.log("message is null");
        }
    }, [message]);

    const submit = async (e) => {
        setMessage(e);
        console.log("e", message);
    };

    function selectRandom(array) {
        var copy = array[0].white.slice(0);
        return function () {
            if (copy.length < 1) {
                // console.log("we are here");
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
                    {messages.map(({ text, user }, index) => (
                        <div key={index}>
                            <div>
                                {user.name}
                                {text}
                            </div>
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
