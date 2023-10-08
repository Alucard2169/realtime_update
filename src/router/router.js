import express from 'express';
import { addUser, getUser } from '../controller/controller.js';
const router = express.Router();


router.get("/getUser",getUser);
router.post("/addUser",addUser)



export default router;