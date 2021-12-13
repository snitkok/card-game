import React from "react";
import Cards from "./cards";
import Answers from "./answers";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io();
const username = prompt("what is your username");

export default function App() {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState([]);
    // const [numUser, setnumUser] = useState([]);

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("username", username);
        });

        socket.on("users", (users) => {
            setUsers(users);
            setCurrentUser(username);
        });

        socket.on("connected", (user) => {
            setUsers((users) => [...users, user]);
        });


        socket.on("disconnected", (id) => {
            setUsers((users) => {
                return users.filter((user) => user.id !== id);
            });
        });
    }, []);

    return (
        <div>
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
