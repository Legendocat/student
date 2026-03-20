const Item = require('../models/Item');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const data = await Item.findAll({ page: Number(page), limit: Number(limit), search });
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while getting items' });
  }
};

exports.getOne = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.status(200).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while getting item' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }
    const item = await Item.create({ title, content, tags, userId: req.user.id });
    return res.status(201).json(item);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while creating item' });
  }
};

exports.update = async (req, res) => {
  try {
    const existing = await Item.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your item' });
    }

    const { title, content, tags } = req.body;
    const updated = await Item.update(req.params.id, {
      title: title || existing.title,
      content: content ?? existing.content,
      tags: tags || existing.tags,
    });
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while updating item' });
  }
};

exports.remove = async (req, res) => {
  try {
    const existing = await Item.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Item not found' });
    }
    if (existing.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your item' });
    }

    await Item.delete(req.params.id);
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while deleting item' });
  }
};

exports.addLike = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const likesCount = await Item.addLike(req.params.id, req.user.id);
    return res.status(200).json({ likesCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while adding like' });
  }
};

exports.removeLike = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const likesCount = await Item.removeLike(req.params.id, req.user.id);
    return res.status(200).json({ likesCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while removing like' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'content is required' });
    }
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    const comment = await Item.addComment(req.params.id, req.user.id, content);
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while adding comment' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Item.findCommentById(req.params.cid);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your comment' });
    }
    const updated = await Item.updateComment(req.params.cid, req.body.content || comment.content);
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while updating comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Item.findCommentById(req.params.cid);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    if (comment.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: not your comment' });
    }
    await Item.deleteComment(req.params.cid);
    return res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error while deleting comment' });
  }
};
