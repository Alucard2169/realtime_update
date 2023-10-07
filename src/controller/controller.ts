import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { db } from "..";
import { getAllUsers, insertUser } from "../database/database";

export interface User {
    id: number;
    name: string;
    email: string;
}

const users:User[] = [];



const getUser = async(req: Request, res: Response) => {
    try {
        
        const result = await getAllUsers(db);

        res.status(200).json(result)

    }
    catch (error: any) {
        res.status(501).json({error: error.message})
    }

}


const addUser = async (req:Request, res:Response) => {
    try {
        const userData = req.body;
        const { username, email, password } = userData;
        const saltRounds = 10;

        const encryptedPass = await bcrypt.hash(
          password,
          saltRounds
        );
        const result = await insertUser(db, username, email, encryptedPass)
        if (result.status !== 'OK') {
           throw new Error("Error  inserting user")
        }
        const userResult = result.user;
        req.app.locals.eventEmitter.emit('userAdded', userResult)
        res.status(201).json({ message: result.message });
    }
    catch (error: any) {
        res.status(409).json({error: error.message})
    }
}




export { addUser, getUser };

