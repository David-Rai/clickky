import db from '../model/db.js'
import { clicks } from '../db/clicks.js'

export const saveToDB = async () => {
    const { global_count } = clicks
    const { users } = clicks

    //storing into the database
    const q1 = 'update global_count set count = ? where id =?'
    const [result1] = await db.execute(q1, [global_count, 1])

    for (const user of users) {
        await db.execute(
            `INSERT INTO users (username, user_count)
             VALUES (?, ?)
             ON DUPLICATE KEY UPDATE
               user_count = VALUES(user_count)`,
            [user.username, user.user_count]
          );
      }

    console.log("saved succesfully to db")
}