const { posts: initialPosts } = require('../data/postStore');

// This repository currently uses in-memory storage.
// If Prisma is introduced later, only the storage implementation
// inside this repository needs to change.
// The repository methods and their return values remain the same,
// so services and controllers do not need to change.

let posts = initialPosts.map((post) => ({ ...post }));

let nextId =
  posts.reduce((highest, post) => Math.max(highest, post.id), 0) + 1;

// Returns all posts as a new array.
function findAll() {
  return posts.map((post) => ({ ...post }));
}

// Returns a post by ID, or null if it does not exist.
function findById(id) {
  const post = posts.find((post) => post.id === Number(id));

  return post ? { ...post } : null;
}

// Creates and returns a new post.
function create(fields) {
  const post = {
    id: nextId++,
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId,
  };

  posts.push(post);

  return { ...post };
}

// Updates a post and returns the updated post, or null if not found.
function update(id, patch) {
  const post = posts.find((post) => post.id === Number(id));

  if (!post) return null;

  if (
    !patch ||
    typeof patch !== 'object' ||
    Array.isArray(patch) ||
    Object.keys(patch).length === 0
  ) {
    return { ...post };
  }

  if (patch.title !== undefined) {
    post.title = patch.title;
  }

  if (patch.body !== undefined) {
    post.body = patch.body;
  }

  return { ...post };
}

// Removes a post and returns true, or false if the post does not exist.
function remove(id) {
  const index = posts.findIndex(
    (post) => post.id === Number(id)
  );

  if (index === -1) return false;

  posts.splice(index, 1);

  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};