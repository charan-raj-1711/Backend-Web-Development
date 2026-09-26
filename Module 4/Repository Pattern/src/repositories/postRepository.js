const {posts: initialPosts} = require('../data/postStore');

let posts = initialPosts.map((post) => ({ ...post}));
let nextId = posts.reduce((highest, post) => Math.max(highest, post.id),0) + 1;

function findAll() {
  return posts.map((post) => ({ ...post }));  // return a copy, not the live array
}

function findById(id) {
   const post = posts.find((post) => post.id === Number(id));

  return post ? { ...post } : null;
}

function create(fields) {
  const post = { 
    id: nextId++, 
    title: fields.title,
    body: fields.body || '',
    authorId: fields.authorId, 
  };
  posts.push(post);
  return { ...post };  // return a copy
}

function update(id, patch) {
  const post = posts.find(p => p.id === Number(id));
  if (!post) return null;
   if (
    !patch ||
    typeof patch !== 'object' ||
    Object.keys(patch).length === 0
  ) {
    return { ...post };
  }
  if(patch.title !== undefined) post.title = patch.title;
  if(patch.body !== undefined) post.body = patch.body;
  return { ...post };
}

function remove(id) {
  const index = posts.findIndex(p => p.id === Number(id));
  if (index === -1) return false;
  posts.splice(index, 1);
  return true;
}

module.exports = { findAll, findById, create, update, remove };