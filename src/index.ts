import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import { UserModel } from './models/users';
import { ContentModel } from './models/content';
import { LinkModel } from './models/link';
import connectToDatabase from "./db";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { middleware } from "./middleware";
import mongoose from "mongoose";
import { random } from "./utils";

const app = express();

app.use(bodyParser.json());
app.use(cors());
const JWT_SECRET = "123!";

(async () => {
    try {
        await connectToDatabase();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process if database connection fails
    }
})();


app.get("/" , function(req , res) {
    res.send("hello world")
})

app.post("/api/v1/signup" , async (req , res) => {

    
    const { username , password } = req.body;   

    const hashedpassword = await bcrypt.hash(password , 10);

    const user = new UserModel({
        username : username,
        password : hashedpassword
    })

    await UserModel.create(user);

    res.send("Signup");
    
})



app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await UserModel.findOne({
        username,
    })

    if(!user){
        res.status(403).send({
            "message" : "No User Found"
        })
    }
    const passwordMatch = await bcrypt.compare(password , user!.password )

    if (user && passwordMatch) {
        const token = jwt.sign({
            id: user._id
        }, JWT_SECRET)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})



app.post("/api/v1/content" ,middleware ,  async(req , res) => {
    const type = req.body.type;
    const link = req.body.link;

    await ContentModel.create({
        type: type,
        link: link,
        title: req.body.title,
        userId: req.userId,
        tags:[]
    })

    res.json({
        "message" : "Content-added"
    })
})

app.get("/api/v1/content" , middleware , async(req , res) => {
    
    const userId = req.userId
    const content = await ContentModel.find({
        userId : userId
    }).populate("userId" , "username")

    res.json({
        content
    })
})



app.delete("/api/v1/content" , middleware , async(req , res) => {

    const contentId = req.body.contentId

    await ContentModel.findOneAndDelete({
        _id: contentId,
        userId: req.userId
    })

    res.json({
        "message" : "deleted"
    })
})

app.post("/api/v1/brain/scheme" , middleware , async(req , res) => {

    const share = req.body.share;

    if(share) {

        const existingLink = await LinkModel.findOne({
            _id: req.userId
        })
        if(existingLink) {
            res.json({
                hash : existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            hash: hash,
            userId: req.userId
        });
        res.json({
            hash: hash
        })
    }else{
        await LinkModel.deleteOne({
            userId : req.userId
        })

        res.json({
            message : "Link removed"
        })
    }
})
app.listen(3000)