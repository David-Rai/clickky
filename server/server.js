import { saveToDB } from './utils/store.js'
import express from 'express'
import db from './model/db.js'
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
    }, 30 * 1000)

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

    // Simple admin login route
    app.post('/auth', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        try {
            // Query the admins table for matching email and password
            const [rows] = await db.query(
                "SELECT * FROM admins WHERE email = ? AND password = ?",
                [email, password]
            );

            if (rows.length === 0) {
                return res.status(401).json({ message: "Invalid email or password" });
            }

            // Admin found
            const admin = rows[0];
            res.json({ message: "Login successful", is_admin: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    });


    const PORT = process.env.PORT || 1111;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();