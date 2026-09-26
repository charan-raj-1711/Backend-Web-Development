const postRepository = require('../repositories/postRepository');

function listPosts() {
  return postRepository.findAll();
}

function getPost(id) {
  return postRepository.findById(id);
}

function createPost(fields) {
  if (!fields || !fields.title) {
    const error = new Error('Title is required');
    error.statusCode = 422;
    throw error;
  }

  try {
    return postRepository.create({
      title: fields.title,
      body: fields.body || '',
      authorId: fields.authorId,
    });
  } catch (error) {
    throw error;
  }
}

function updatePost(id, patch) {
  return postRepository.update(id, patch);
}

function removePost(id) {
  return postRepository.remove(id);
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  updatePost,
  removePost,
};