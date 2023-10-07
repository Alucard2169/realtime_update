    import express from 'express';
import path from 'path';
import { initializeDatabase } from './database/database';
import router from './router/router';
export let db:any;


    const PORT = process.env.PORT || 8000;
    const app = express();

    app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json())
    


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'../public','index.html'))
})


app.use("/api/v1",router)




const startServer = async () => {
    try {
         db = await initializeDatabase()
       
         app.listen(PORT, () => {
             console.log(`Server running on port ${PORT}`)
        })
    }
    catch (err) {
        console.log('Failed to initialize the database', err)
    }
}


startServer()

