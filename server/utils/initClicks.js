import db from '../model/db.js';
import { clicks } from '../db/clicks.js';

export const initClicks = async () => {
  try {
    // Fetch global count
    const [globalRows] = await db.execute('SELECT count FROM global_count WHERE id = 1');
    clicks.global_count = globalRows[0]?.count ?? 0;

    // Fetch users
    const [userRows] = await db.execute('SELECT username, user_count FROM users');
    clicks.users = userRows.map(u => ({
      username: u.username,
      user_count: u.user_count
    }));
    // Sort users by user_count descending (highest to lowest)
    clicks.users.sort((a, b) => b.user_count - a.user_count);

    console.log('In-memory data initialized from database');
  } catch (err) {
    console.error('Error initializing in-memory data:', err);
  }
};
