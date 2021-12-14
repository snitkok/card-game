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

    return (
        <div>
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
            <Cards />
            <Answers currentUser={currentUser} />
        </div>
    );
}
