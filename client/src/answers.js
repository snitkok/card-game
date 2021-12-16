import React from "react";
import cards from "./cardListFull";
import { useState, useEffect } from "react";
import Answer from "./answer";
import Likes from "./likes";

import { socket } from "./socket";

export default function Answers() {
    //for selecting 5 cards messages
    const [cardAnswers, setCardAnswers] = useState([]);
    //sets state of a single card that was clicked
    const [message, setMessage] = useState();
    const [messages, setMessages] = useState([]);
    // const [gameResult, setGameResult] = useState({});
    const [button, setButton] = useState(true);

    useEffect(() => {
        socket.on("message", (message) => {
            setMessages((messages) => [...messages, message]);
        });
    }, []);

    useEffect(() => {
        if (typeof message !== "undefined") {
            socket.emit("send", message);
        } else {
            console.log("message is null");
        }
    }, [message]);

    const likeResults = (isLiked, userId) => {
        let count = 0;

        if (!isLiked) {
            count++;
            console.log(userId, count);
            socket.emit("likesCount", userId, count);
        } else if (isLiked) {
            count--;
            console.log(userId, count);
            socket.emit("likesCount", userId, count);
        }
        socket.on("result", (result) => {
            nextGame(result);
            console.log(result);
        });
        console.log(userId, count);
    };

    const nextGame = (result) => {
        //if user confirms then socket.emit
        confirm(result);
        if (confirm) {
            setMessages([]);
            socket.emit("nextGame");
        }
    };

    const submit = (e) => {
        setMessage(e);
        console.log("e", message);
    };

    function selectRandom(array) {
        let copy = array[0].white.slice(0);
        return function () {
            if (copy.length < 1) {
                copy = array[0].white.slice(0);
            }
            const array = [];
            for (let i = 0; i < 5; i++) {
                let index = Math.floor(Math.random() * copy.length);
                let item = copy[index]["text"];
                copy.splice(index, 1);
                array.push(item);
            }

            setCardAnswers(array);
            return console.log(cardAnswers);
        };
    }

    const chooser = selectRandom(cards);

    function addOne() {
        let copy = cards[0].white.slice(0);
        return function () {
            let index = Math.floor(Math.random() * copy.length);
            let item = copy[index];
            copy.splice(index, 1);
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
    }

    function handleButton() {
        setButton(!button);
    }

    return (
        <div className="answers">
            <div className="playGround">
                <h3></h3>
                <hr />
                <div id="messages">
                    {console.log(" 🐈", messages)}
                    {messages.map(({ text, user }, index) => (
                        <div key={index} className="playedCardsContainer">
                            <div className="playedCards">
                                {user.name}
                                <Likes
                                    likeResults={likeResults}
                                    userId={user.id}
                                />
                                {text}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="answerOpt">
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
            </div>
            <div>
                {button ? (
                    <button
                        onClick={() => {
                            chooser();
                            handleButton();
                        }}
                    >
                        Get playing cards
                    </button>
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
}
