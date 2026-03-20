const pool = require('../config/db');

class Item {
  static async findAll({ page = 1, limit = 10, search = '' }) {
    const offset = (page - 1) * limit;
    const searchValue = `%${search}%`;

    const [rows] = await pool.execute(
      `SELECT i.*, u.username,
              (SELECT COUNT(*) FROM likes l WHERE l.item_id = i.id) AS likesCount,
              (SELECT COUNT(*) FROM comments c WHERE c.item_id = i.id) AS commentsCount
       FROM items i
       JOIN users u ON u.id = i.user_id
       WHERE (? = '' OR i.title LIKE ? OR JSON_SEARCH(COALESCE(i.tags, JSON_ARRAY()), 'one', ?) IS NOT NULL)
       ORDER BY i.created_at DESC
       LIMIT ? OFFSET ?`,
      [search, searchValue, search, Number(limit), Number(offset)]
    );

    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total
       FROM items i
       WHERE (? = '' OR i.title LIKE ? OR JSON_SEARCH(COALESCE(i.tags, JSON_ARRAY()), 'one', ?) IS NOT NULL)`,
      [search, searchValue, search]
    );

    return {
      items: rows.map((row) => ({
        ...row,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [],
      })),
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: countRows[0].total,
        totalPages: Math.ceil(countRows[0].total / limit),
      },
    };
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT i.*, u.username,
              (SELECT COUNT(*) FROM likes l WHERE l.item_id = i.id) AS likesCount
       FROM items i
       JOIN users u ON u.id = i.user_id
       WHERE i.id = ?`,
      [id]
    );
    if (!rows[0]) return null;
    const item = rows[0];
    item.tags = typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags || [];

    const [comments] = await pool.execute(
      `SELECT c.id, c.content, c.created_at, c.user_id, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.item_id = ?
       ORDER BY c.created_at ASC`,
      [id]
    );

    item.comments = comments;
    return item;
  }

  static async create({ title, content, tags, userId }) {
    const [result] = await pool.execute(
      'INSERT INTO items (title, content, tags, user_id) VALUES (?, ?, ?, ?)',
      [title, content || '', JSON.stringify(tags || []), userId]
    );
    return this.findById(result.insertId);
  }

  static async update(id, { title, content, tags }) {
    await pool.execute(
      'UPDATE items SET title = ?, content = ?, tags = ? WHERE id = ?',
      [title, content || '', JSON.stringify(tags || []), id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async addLike(itemId, userId) {
    await pool.execute('INSERT IGNORE INTO likes (item_id, user_id) VALUES (?, ?)', [itemId, userId]);
    return this.getLikesCount(itemId);
  }

  static async removeLike(itemId, userId) {
    await pool.execute('DELETE FROM likes WHERE item_id = ? AND user_id = ?', [itemId, userId]);
    return this.getLikesCount(itemId);
  }

  static async getLikesCount(itemId) {
    const [rows] = await pool.execute('SELECT COUNT(*) AS count FROM likes WHERE item_id = ?', [itemId]);
    return rows[0].count;
  }

  static async addComment(itemId, userId, content) {
    const [result] = await pool.execute(
      'INSERT INTO comments (content, item_id, user_id) VALUES (?, ?, ?)',
      [content, itemId, userId]
    );
    const [rows] = await pool.execute(
      `SELECT c.id, c.content, c.created_at, c.item_id, c.user_id, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [result.insertId]
    );
    return rows[0];
  }

  static async findCommentById(commentId) {
    const [rows] = await pool.execute('SELECT * FROM comments WHERE id = ?', [commentId]);
    return rows[0] || null;
  }

  static async updateComment(commentId, content) {
    await pool.execute('UPDATE comments SET content = ? WHERE id = ?', [content, commentId]);
    const [rows] = await pool.execute(
      `SELECT c.id, c.content, c.created_at, c.item_id, c.user_id, u.username
       FROM comments c
       JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [commentId]
    );
    return rows[0] || null;
  }

  static async deleteComment(commentId) {
    const [result] = await pool.execute('DELETE FROM comments WHERE id = ?', [commentId]);
    return result.affectedRows > 0;
  }
}

module.exports = Item;
