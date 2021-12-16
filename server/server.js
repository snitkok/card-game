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
app.locals.likesCount = 0;

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
    let copy = array[0].black.slice(0);
    return function () {
        if (copy.length < 1) {
            // console.log("we are hee");
            copy = array[0].black.slice(0);
        }
        let index = Math.floor(Math.random() * copy.length);
        let item = copy[index];
        copy.splice(index, 1);
        return item.text;
    };
}




io.on("connection", (socket) => {
    // console.log("socket.id", socket.id);
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
        let chooser = selectRandom(cards);
        io.emit("chooser", chooser());
        console.log("^^^^^^^", users);
        const userCount = Object.keys(users).length;
        io.emit("userCount", userCount);
        console.log("userCount", userCount);
    });

    socket.on("userCount", (userCount) => {
        userCount = Object.keys(users).length;
        io.emit("userCount", userCount);
        console.log("another user  ", userCount);
    });
//use app locals here
    socket.on("likesCount", (userId, count) => {
        let totalCounts = 0;
        let result = "";
        // let usersWithLikes = users;
        for (let user in users) {
            if (users[user].id === userId) {
                users[user].counter += count;
            }
            totalCounts += users[user].counter;
        }
        console.log("Total Counts in the round: " + totalCounts);
        console.log(users);

        // if total count of likes among all users is equal to length of users object (we assume all users have voted)
        if (totalCounts >= Object.keys(users).length) {
            // we create array of users from users object to be able to apply map function
            const usersArray = Object.values(users);
            // we extract max count of likes (count of likes that the most voted post has)
            const maxCount = Math.max.apply(
                Math,
                usersArray.map((user) => user.counter)
            );
            // we create array of users that have max count of likes
            const winnersArray = usersArray.filter(
                (user) => user.counter === maxCount
            );
            // we extract from array of winners just winners names to add them to result string
            const winnerNames = winnersArray.map((winner) => winner.name);

            // we create two result strings based on how many users have collected max count of likes.
            // If array of winners more than 1 (we have several players in winners array with max count of likes
            if (winnersArray.length > 1) {
                result = `We have a tie. Players ${winnerNames.join(
                    " and "
                )} have ${maxCount} vote(s)!!!
Would you like to continue?`;
            } else {
                result = `The winner is ${winnerNames.join(
                    ""
                )} with ${maxCount} vote(s)!!!
Would you like to continue?`;
            }
            // Send winner to front with winner's answer
            io.emit("result", result);
            // Reset total count of likes to 0;
            totalCounts = 0;
            // Reset likes counter of each player to 0;
            for (let user in users) {
                users[user].counter = 0;
            }
            console.log("Total Counts After the round: " + totalCounts);
            console.log(users);
        }
    });

    //listen to when the user submits an answer(message card)
    socket.on("send", (message) => {
        // console.log("users[socket.id]", socket.id);
        io.emit("message", {
            text: message,
            user: users[socket.id],
        });
    });

    //when user clicks next round
    socket.on("nextGame", () => {
        let chooser = selectRandom(cards);
        io.emit("selectCard", chooser());
        // console.log("chooser 🌺 ", chooser);
    });

    //when user disconnects
    socket.on("disconnect", () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit("disconnected", socket.id);
        console.log(")))))^^", users);
        userCount = Object.keys(users).length;
        io.emit("userCount", userCount);
        console.log("Usercount here is", userCount);
    });

    // console.log("users", users);
});
