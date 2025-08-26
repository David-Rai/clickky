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

        // Handle "delete" event from client
        client.on("delete", (username) => {
            if (!username || username.trim() === "") return;

            // Find if user exists
            const userIndex = clicks.users.findIndex(u => u.username === username);
            if (userIndex === -1) {
                return
            }

            // Remove user from the array
            clicks.users.splice(userIndex, 1)[0]; // splice returns an array

            // Return deleted user
            console.log("deleting user", username)

            // Sort leaderboard descending by user_count
            clicks.users.sort((a, b) => b.user_count - a.user_count);

            // Broadcast updated leaderboard to all clients
            io.emit("leaderboard-update", clicks);
        });

        // Handle "delete" event from client
        client.on("update", ({ username, newCount }) => {
            if (!username || username.trim() === "") return;

            const userIndex = clicks.users.findIndex(u => u.username === username);

            if (userIndex === -1) {
                return
            }

            // Update the user
            clicks.users[userIndex] = {
                ...clicks.users[userIndex],
                user_count:newCount,
            };

            console.log("updated user", username)

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