import React from "react";
import Cards from "./cards";
import Answers from "./answers";
import { useState, useEffect } from "react";
const username = prompt("what is your username");
import { socket } from "./socket";

export default function App() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    const [newUser, setNewUser] = useState([]);

    useEffect(() => {
        //when user connects to the  server
        //we emit username to the server
        socket.on("connect", () => {
            socket.emit("username", username);
        });

        socket.on("users", (users) => {
            setUsers(users);
            setCurrentUser(username);
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
        if (start) {
            const username = prompt("what is your username");
            if (usersCount < 3) {
                setWaiting(true);
            }
        }
    }

    return (
        <div className="root">
            {/* <div id="modalStart">
                <div id="modal-content">
                    <p className="text-4xl  p-8">Want to start the game</p>
                    <br />
                    <button onClick={() => {}}>Start</button>
                </div>
            </div>

            <div id="modalWait">
                <div id="modal-content">
                    <p className="text-4xl  p-8">Want to start the game</p>
                    <br />
                    <button onClick={() => {}}>Start</button>
                </div>
            </div> */}
            <div className="itemOne">
                <h1>Hello {currentUser} </h1>
                <h3>{newUser.name} joined the game</h3>
                <div>
                    <h6>Users online</h6>
                    <ul id="users">
                        {users.map(({ name, id }) => (
                            <li key={id}>{name}</li>
                        ))}
                    </ul>
                </div>
            </div>
            
            <div className="itemTwo">
                <Cards />
                <Answers currentUser={currentUser} />
            </div>
        </div>
    );
}
