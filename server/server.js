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
    console.log("socket.id", socket.id);
    //when someone connects to the server we will invoke this callback
    //when submits the username
    socket.on("username", (username) => {
        const user = {
            name: username,
            id: socket.id,
            counter: 0,
        };
        users[socket.id] = user;
        //here we broadcast events to every connected user
        io.emit("connected", user);
        io.emit("users", Object.values(users));
        var chooser = selectRandom(cards);
        io.emit("chooser", chooser());
        console.log("^^^^^^^", users);
    });

    socket.on("likesCount", (userId) => {
        let allCounts = 0;
        for (let user in users) {
            if (users[user].id === userId) {
                users[user].counter++;
            }
            allCounts += users[user].counter;
            if (allCounts >= "number of users") {
                // 1. find user with highest count
                // 2. send winner to front with winner's answer
                // 3. reset global counter and counter for each user
                users[user].counter = 0;

                // if user on front clicks "Continue the game" start function
                // "chooser" to display new Question Card
            }
        }
        console.log(users.length, allCounts);
    });

    //listen to when the user submits an answer(message card)
    socket.on("send", (message) => {
        console.log("users[socket.id]", socket.id);
        io.emit("message", {
            text: message,
            user: users[socket.id],
        });
    });

    //when user clicks next round
    socket.on("nextGame", () => {
        var chooser = selectRandom(cards);
        io.emit("selectCard", chooser());
        console.log("chooser 🌺 ", chooser);
    });

    //when user disconnects
    socket.on("disconnect", () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit("disconnected", socket.id);
        console.log(")))))^^", users);
    });

    console.log("users", users);
});
