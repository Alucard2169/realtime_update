import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { db } from "..";
import { insertUser } from "../database/database";


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
           throw new Error("Error while inserting user")
        }
         
        res.status(201).json({ message: result.message });
    }
    catch (error: any) {
        res.json({error: error.message})
    }
}


export { addUser };
