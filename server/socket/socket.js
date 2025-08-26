import { clicks } from "../db/clicks.js";

export const handleSocket = (io) => {
    io.on("connection", (client) => {
        console.log("New client connected:", client.id);

        // Handle "increase" event from client
        client.on("increase", (username) => {
            if (!username || username.trim() === "") return;

            // Update or add user
            const existingUser = clicks.users.find((u) => u.username === username);
            if (existingUser) {
                existingUser.user_count += 1;
            } else {
                clicks.users.push({ username, user_count: 1 });
            }

            clicks.global_count += 1;

            // Sort leaderboard descending by user_count
            clicks.users.sort((a, b) => b.user_count - a.user_count);

            // Broadcast updated leaderboard to all clients
            io.emit("leaderboard-update", clicks);
        });

        client.on("disconnect", () => {
            console.log("Client disconnected:", client.id);
        });
    });

}