import { saveToDB } from './utils/store.js'
import express from 'express'
import { handleSocket } from './socket/socket.js'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { clicks } from './db/clicks.js'
import { initClicks } from './utils/initClicks.js';

(async () => {
    initClicks();  // fetch data from DB before starting the server

    //Socket instance
    const corsOption = {
        // origin: "http://localhost:3000"
        origin: "*"
    }
    const app = express();
    const server = http.createServer(app)
    const io = new Server(server, {
        cors: corsOption
    })


    //Middlewares
    app.use(cors(corsOption))
    app.use(express.json());


    //Socket connection handling
    handleSocket(io)

    //Storing into database every 30 seconds
    setInterval(() => {
        saveToDB()
    }, 5 * 1000)

    //Routes
    app.get('/', (req, res) => {
        res.json(clicks);
    });

    //adding new user
    app.post('/addUser', (req, res) => {
        const { username } = req.body

        //checking existance of username
        const existingUser = clicks.users.find((u) => u.username === username);

        if (existingUser) {
            // existingUser.user_count += 1; // increment count
            return res.json({ user_existed: true, clicks })
        } else {
            clicks.users.push({ username, user_count: 1 }); // new user with default count 1
        }

        // Sort users by user_count descending (highest to lowest)
        clicks.users.sort((a, b) => b.user_count - a.user_count);

        //Response
        res.json({ user_existed: false, clicks })

    });

    const PORT = process.env.PORT || 1111;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();