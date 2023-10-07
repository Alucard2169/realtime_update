import { EventEmitter } from 'events';
import express from 'express';
import http from 'http';
import path from 'path';
import WebSocket from 'ws';
import { User } from './controller/controller';
import { initializeDatabase } from './database/database';
import router from './router/router';
export let db:any;


const PORT = process.env.PORT || 8000;
const app = express();

// Create an HTTP server
const server = http.createServer(app);

const eventEmitter = new EventEmitter()
app.locals.eventEmitter = eventEmitter;

const webSocketServer = new WebSocket.Server({ server });




webSocketServer.on("connection", (ws) => {
 
  console.log(`WebSocket connection established`);

const handleUserAdded = (userResult:User) => {
  ws.send(JSON.stringify({ type: "userAdded", data: userResult }));
};

    
    eventEmitter.on("userAdded", handleUserAdded
    )

    ws.on("close", () => {
      console.log("WebSocket connection closed");
      eventEmitter.off("userAdded",handleUserAdded);
    });
});


app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json())
    


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,'../public','index.html'))
})


app.use("/api/v1",router)




const startServer = async () => {
    try {
         db = await initializeDatabase()
       
         server.listen(PORT, () => {
             console.log(`Server running on port ${PORT}`)
        })
    }
    catch (err) {
        console.log('Failed to initialize the database', err)
    }
}


startServer()

