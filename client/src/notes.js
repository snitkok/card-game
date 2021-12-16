// if total count of likes among all users is equal to length of users object (we assume all users have voted)
        if (totalCounts === Object.keys(users).length) {
            // we create array of users from users object to be able to apply map function
            const usersArray = Object.values(users);
            // we extract max count of likes (count of likes that the most voted post has)
            const maxCount = Math.max.apply(Math, usersArray.map((user) => user.counter));
            // we create array of users that have max count of likes
            const winnersArray = usersArray.filter(user => user.counter === maxCount);
            // we extract from array of winners just winners names to add them to result string
            const winnerNames = winnersArray.map(winner => winner.name);

            // we create two result strings based on how many users have collected max count of likes. 
            // If array of winners more than 1 (we have several players in winners array with max count of likes
            if (winnersArray.length > 1) {
                result = `We have a tie. Players ${winnerNames.join(" and ")} have ${maxCount} vote(s)!!!
Would you like to continue?`;
            } else {
                result = `The winner is ${winnerNames.join("")} with ${maxCount} vote(s)!!!
Would you like to continue?`;
            }

            // Send winner to front with winner's answer
            io.emit("result", result);
            console.log(result, users);
        }
    });