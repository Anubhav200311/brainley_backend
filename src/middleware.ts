import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction , Request , Response  } from "express";

const JWT_SECRET = "123!";

export const middleware = (req:Request , res: Response , next: NextFunction ) => {

    const header = req.headers['authorization'];
    const decoded = jwt.verify(header as string , JWT_SECRET )

    if(decoded) {
        if(typeof decoded === "string") {
            res.status(403).json({
                "message" : "You are not logged in"
            })
            return;
        }
        req.userId = (decoded as JwtPayload).id;
        next();
    }else{
        res.status(403).json({
            message : "You are not logged in"
        })
    }
}