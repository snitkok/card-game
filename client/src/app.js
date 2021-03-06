import React from "react";
import Cards from "./cards";
import Answers from "./answers";
import { useState, useEffect } from "react";
let username = prompt("Ready to start? Enter your username");
import { socket } from "./socket";

export default function App() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [newUser, setNewUser] = useState([]);
    const [modal, setModal] = useState(true);
    const [userCount, setUserCount] = useState(0);
    const [waiting, setWaiting] = useState(false);
    const [userName, setUserName] = useState("");
    console.log("First userCOUNT log", userCount);

    useEffect(() => {
        console.log(" userCOUNT in useeffect", userCount);

        if (userCount >= 2) {
            console.log("show modal");
            setWaiting(false);
        } else {
            console.log("hide modal");
            setWaiting(true);
        }
    }, [userCount]);

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("username", username);
        });

        socket.on("users", (users) => {
            setUsers(users);
            setCurrentUser(username);
        });

        socket.on("userCount", (data) => {
            setUserCount(data);
            console.log("userCount", userCount, data);
        });

        socket.on("connected", (user) => {
            setUsers((users) => [...users, user]);
            setNewUser(user);
            console.log("user", user);
        });

        socket.on("disconnected", (id) => {
            setUsers((users) => {
                return users.filter((user) => user.id !== id);
            });
        });
    }, []);

    function gameStart() {
        setModal(!modal);

        if (userCount < 2) {
            setWaiting(true);
            console.log("userCount(;(;(;(;(;((;", userCount);
        } else {
            socket.emit(userCount);
        }
    }

    return (
        <div className="root">
            {waiting ? (
                <div id="modalWait">
                    <div id="modal-content">
                        <h3>Waiting for other users to join</h3>
                        <h3>Now {userCount} users are online</h3>
                        <img src="./waiting.gif" className="waitingGif" />
                    </div>
                </div>
            ) : (
                <p></p>
            )}
            {modal ? (
                <div id="modalStart">
                    <div id="modal-content">
                        <h3>
                            Cards Against Humanity is a fill-in-the-blank party
                            game that turns your awkward personality and
                            lackluster social skills into hours of fun! <br />
                            <div className="pulsating">Wow.</div>The game is
                            simple. Each round, computer asks a question from a
                            black card, and everyone else answers with their
                            funniest white card.
                        </h3>
                        <br />
                        <div>
                            <h3 className="start">
                                Still want to start the game?
                            </h3>
                        </div>
                        <br />
                        <button
                            className="buttonStart"
                            onClick={() => {
                                gameStart();
                            }}
                        >
                            <span>Start</span>
                        </button>
                    </div>
                </div>
            ) : (
                <p></p>
            )}
            <div className="itemOne">
                <div className="firstLine">
                    <h1>
                        Hello <span style={{ color: "white" }}>{currentUser} ??????</span>
                    </h1>
                    {/* <h3 className="recentUser">
                        <span className="newUserName">{newUser.name}</span> just
                        joined the game
                    </h3> */}
                </div>
                <div>
                    <h3>
                        <span style={{ color: "white" }}>{userCount}</span>{" "}
                        users are online:
                    </h3>
                    <div id="users">
                        {users.map(({ name, id }) => (
                            <p key={id}>??????{name}</p>
                        ))}
                    </div>
                </div>
            </div>
            <div className="itemTwo">
                <Cards />
                <Answers currentUser={currentUser} />
            </div>
        </div>
    );
}
