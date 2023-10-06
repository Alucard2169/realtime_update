import express from 'express';
import path from 'path';


const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.static(path.join(__dirname, '../public')));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'../public','index.html'))
})



app.listen(PORT,()=>console.log(`server running on port ${PORT}`))