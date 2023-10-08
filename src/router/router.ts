import express from 'express';
import { addUser, getUser } from '../controller/controller';
const router = express.Router();


router.get("/getUser",getUser);
router.post("/addUser",addUser)



export default router;