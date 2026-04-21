import cors from "cors";
import express from "express";

const app = express();
const port = 8000;

const users = {
    users_list: [
        {
            id: "xyz789",
            name: "Charlie",
            job: "Janitor"
        },
        {
            id: "abc123",
            name: "Mac",
            job: "Bouncer"
        },
        {
            id: "ppp222",
            name: "Mac",
            job: "Professor"
        },
        {
            id: "yat999",
            name: "Dee",
            job: "Aspring actress"
        },
        {
            id: "zap555",
            name: "Dennis",
            job: "Bartender"
        }
    ]
};

const findUserByName = (name) => {
    return users["users_list"].filter(
        (user) => user["name"] === name
    );
};

const findUserByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => user["name"] === name && user["job"] === job
    );
};

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const createId = () => {
    let newId = "";
    for (let i = 0; i < 3; i++) {
        newId += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    }
    for (let i = 0; i < 3; i++) {
        newId += "0123456789"[Math.floor(Math.random() * 10)];
    }
    return newId;
}

const addUser = (user) => {
    user.id = createId();
    users["users_list"].push(user);
    return user;
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}`
    );
});

// Get users with the name name and same job
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;
    if (name != undefined) {
        let result;
        if (job != undefined) {
            result = findUserByNameAndJob(name, job);
            result = { users_list: result };
        } else {
            result = findUserByName(name);
            result = { users_list: result };
        }
        res.send(result);
    } else {
        res.send(users);
    }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

// Add a new user to the users list
app.post("/users", (req, res) => {
    const userToAdd = req.body;
    let newUser = addUser(userToAdd);
    console.log(newUser);
    res.status(201).send(newUser);
});

// Delete user by user's ID
app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];
    const userIndex = users["users_list"].findIndex((user) => user["id"] === id);
    if (userIndex === -1) {
        res.status(404).send("Resource not found.");
    } else {
        users["users_list"].splice(userIndex, 1);
        res.status(204).send();
    }
});

