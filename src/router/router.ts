import express from 'express';
import { addUser } from '../controller/controller';
const router = express.Router();



router.post("/addUser",addUser)



export default router;