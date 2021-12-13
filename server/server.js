const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const server = require("http").Server(app);
const cookieSession = require("cookie-session");
const cards = require("../client/src/cardListFull");
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

const cookieSessionMiddleware = cookieSession({
    secret: `I am so secret`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

const users = {};

function selectRandom(array) {
    var copy = array[0].black.slice(0);
    return function () {
        if (copy.length < 1) {
            console.log("we are hee");
            copy = array[0].black.slice(0);
        }
        var index = Math.floor(Math.random() * copy.length);
        var item = copy[index];
        copy.splice(index, 1);
        return item.text;
    };
}

io.on("connection", (socket) => {
    socket.on("username", (username) => {
        const user = {
            name: username,
            id: socket.id,
        };
        users[socket.id] = user;
        io.emit("connected", user);
        io.emit("users", Object.values(users));
        var chooser = selectRandom(cards);
        console.log("chooser", chooser());
        console.log("^^^^^^^", users);
    });

    socket.on("send", (message) => {
        io.emit("message", {
            text: message,
            user: users[socket.id],
        });
    });

    // socket.on("startGame", () => {
    //     var chooser = selectRandom(cards);
    //     io.emit("selectCard", chooser);
    //     console.log("chooser", chooser);
    // });

    socket.on("disconnect", () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit("disconnected", socket.id);
        console.log(")))))^^", users);
    });

    console.log("users", users);
});
