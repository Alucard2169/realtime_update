import { Request, Response } from "express";


const addUser = async (req:Request, res:Response) => {
    try {
        const userData = req.body;

        res.json(userData)
    }
    catch (error: any) {
        res.json({error: error.message})
    }
}


export { addUser };
