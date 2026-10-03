const pool = require("./pools");

exports.getUserByUsername = async (username) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const user = rows[0];
    return user;
}

exports.getUserById = async (id) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];
    return user;
}

exports.createUser = async (username, hashedPassword, first_name, last_name) => {
    const result = await pool.query("INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, username",
    [username, hashedPassword, first_name, last_name]);
    return result.rows[0];
}

exports.createMessage = async (title, content, user_id) => {
    const result = await pool.query("INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, user_id]);
    return result.rows[0];
}

exports.getMessages = async () => {
    const result = await pool.query(`
        SELECT 
            messages.message_id,
            messages.title,
            messages.content,
            messages.created_at,
            users.username,
            users.first_name,
            users.last_name
        FROM messages
        JOIN users ON messages.user_id = users.id
        ORDER BY messages.created_at DESC
    `);
    
    return result.rows;
};

exports.promoteUser = async (user_id) => {
    await pool.query(
        `UPDATE users SET member = TRUE WHERE id = $1`,
        [user_id]
    );
}

exports.promoteMember = async (user_id) => {
    await pool.query(
        `UPDATE users SET admin = TRUE WHERE id = $1`,
        [user_id]
    );
}

exports.deleteUserMessage = async (message_id) => {
    await pool.query(
        `DELETE FROM messages WHERE message_id = $1`,
        [message_id]
    );
}