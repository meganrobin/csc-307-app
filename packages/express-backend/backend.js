import cors from "cors";
import express from "express";
import userModel from "./models/user.js";
import user_service from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
    .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
    .catch((error) => console.log(error));

const app = express();
const port = 8000;

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

// Get users with the same name and same job
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    user_service.getUsers(name, job).then((r) => {
        console.log(r);
        res.send(r);
    });
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = user_service.findUserById(id);
    console.log(result);
    if (result === undefined) {
        res.status(404).send("Resource not found.");
    } else {
        res.send(result);
    }
});

// Add a new user to the users list
app.post("/users", (req, res) => {
    const userToAdd = req.body;

    user_service.addUser(userToAdd).then((newUser) => {
        res.status(201).send(newUser);
    }).catch((error) => {
        res.status(500).send("Internal server error");
    });
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];

    userModel.findByIdAndDelete(id).then((deletedUser) => {
        if (!deletedUser) {
            res.status(404).send("Resource not found.");
        } else {
            res.status(204).send();
        }
    }).catch((error) => {
        res.status(500).send("Internal server error");
    });
});

