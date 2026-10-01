// const seed = require('../data/postSeed');

// // Starter implementation: same async contract, temporary in-memory storage.
// const posts = seed.map((post) => ({ ...post }));
// let nextId = posts.reduce((max, post) => Math.max(max, post.id), 0) + 1;


const prisma = require('../lib/prisma');

function handleDatabaseError(error) {
  if(error && error.code === 'P2002') {
    const conflict = new Error('A record with these values already exists');
    conflict.statusCode = 409;
    throw conflict;
  }

  if (error && error.code === 'P2003') {
    const conflict = new Error('The related record does not exist');
    conflict.statusCode = 409;
    throw conflict;
  }

  throw error;
}
async function findAll() {
  // return posts.map((post) => ({ ...post }));
  return prisma.post.findMany({
    orderBy: {
      id: 'asc'
    }
  });
}

async function findById(id) {
  // return posts.find((post) => post.id === Number(id)) || null;
  return prisma.post.findUnique({
    where: {
      id: Number(id)
    }
  });
}

async function create(fields) {
  // const post = { id: nextId++, title: fields.title, body: fields.body || '', authorId: fields.authorId };
  // posts.push(post);
  // return { ...post };
  try {
    return await prisma.post.create({
      data: {
        title: fields.title,
        body: fields.body || '',
        authorId: fields.authorId
      }
    });
  } catch (error) {
    handleDatabaseError(error);
  }
}

async function update(id, patch) {
  // const post = posts.find((candidate) => candidate.id === Number(id));
  // if (!post) return null;
  // if (patch.title !== undefined) post.title = patch.title;
  // if (patch.body !== undefined) post.body = patch.body;
  // return { ...post };

  const postId = Number(id);

  try {
    return await prisma.post.update({
      where: {
        id: postId
      },
      data: {

        ...(patch && patch.title !== undefined
        ? { title: patch.title}
        : {}),
        ...(patch && patch.body !== undefined
          ? {body: patch.body}
          : {})
      }
    });  
  } catch (error){
    if (error && error.code === 'P2025') {
      return null;
    }
    handleDatabaseError(error);
  }
}

async function remove(id) {
  // const index = posts.findIndex((post) => post.id === Number(id));
  // if (index === -1) return false;
  // posts.splice(index, 1);
  // return true;

  try {
    await prisma.post.delete({
      where: {
        id: Number(id)
      }
    });

    return true;
  } catch (error) {
    if(error && error.code === 'P2025') {
      return false;
    }
    handleDatabaseError(error);
  }
}

module.exports = { findAll, findById, create, update, remove };
