import express, { Request, Response } from "express";
import bodyParser from "body-parser";

import { UserModel } from './models/users';
import { ContentModel } from './models/content';
import connectToDatabase from "./db";
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { middleware } from "./middleware";

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



app.post("/api/v1/signin" , async(req , res) => {

    const username : string = req.body.username
    const password : string = req.body.password

    const user = await UserModel.findOne({
        username: username,
    })
    
    if(!user) {
        res.status(403).json({
            "message" : "No User found"
        })
    }

    const passwordMatch = await bcrypt.compare(password , user!.password);

    if( user && passwordMatch ) {
        const token = jwt.sign({
            id: user._id.toString()
        } , JWT_SECRET);

        res.json({
            token
        })
    }
    else{
        res.status(403).json({
            "message" : "Incorrect Creds"
        })
    }
    
})

app.post("/api/v1/contents" ,middleware ,  async(req , res) => {
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

app.get("/api/v1/contents" , middleware , async(req , res) => {
    
    const userId = req.userId
    const content = ContentModel.find({
        userId : userId
    }).populate("userId" , "username")

    res.json({
        content
    })
})



app.listen(3000)