# Clickky - Real-Time Global Counter with User Tracking

## Overview

**Clickky** is a web application that allows users to interact in real-time with a global counter and individual user counts. The application is built using **Node.js, MySQL, and modern frontend technologies**. It demonstrates real-time updates, database synchronization, and scalable backend design.

---

## Features

- **Global Counter**: Tracks total clicks across all users.
- **User Tracking**: Maintains individual counts for each user.
- **Real-Time Updates**: Syncs in-memory counters to MySQL every 30 seconds.
- **Automatic Database Handling**:
  - Inserts new users automatically.
  - Updates existing users’ counts without duplicating entries.
- **Secure and Efficient DB Operations**:
  - Uses `ON DUPLICATE KEY UPDATE` for efficient inserts/updates.
  - Ensures unique usernames in the database.
- **VPS Ready**: Can be hosted on any VPS with Node.js and MySQL.

---

## Tech Stack

**Backend:**
- Node.js
- Express.js (for API and server)
- MySQL (database)
- mysql2/promise (database driver)

**Frontend (planned/optional):**
- Next.js / React.js

**Other Tools:**
- PM2 (process manager for Node.js)
- Nginx (for reverse proxy and SSL, optional)
- Git & GitHub (version control)

---


---

## How It Works

1. **In-Memory Storage**:
   - `clicks.js` maintains the `global_count` and a list of users with their individual counts.
2. **Periodic Database Sync**:
   - `store.js` contains a function that runs every 30 seconds to save all data into MySQL.
   - Uses `INSERT ... ON DUPLICATE KEY UPDATE` to avoid duplicates and update user counts.
3. **Unique Usernames**:
   - The `users` table enforces unique usernames to maintain data integrity.

---

## Database Schema

### users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    user_count INT DEFAULT 0
);

```
# Clone the repo
```bash
git clone https://github.com/David-Rai/clickky.git
cd clickky/server
```