require('dotenv').config();
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_NAME = process.env.COLLECTION_NAME;

let client;
let db;

// Initialize MongoDB connection
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Connected to MongoDB');
  }
  return db;
}

exports.getUserByUsername = async (username) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    const user = await collection.findOne({ username });
    return user;
  } catch (error) {
    console.error('Error getting user by username:', error);
    return null;
  }
};

exports.getUserById = async (id) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    const user = await collection.findOne({ id: parseInt(id) });
    return user;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
};

exports.checkPasswordWithQuery = async (userId, passwordQuery) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    const user = await collection.findOne({ id: userId, password: passwordQuery });
    return !!user;
  } catch (error) {
    console.error('Error checking password with query:', error);
    return false;
  }
};

exports.createUser = async (userData) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);

    const existingUser = await collection.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const lastUser = await collection.findOne({}, { sort: { id: -1 } });
    const nextId = lastUser ? lastUser.id + 1 : 1;

    const newUser = {
      id: nextId,
      username: userData.username,
      password: userData.password
    };

    const result = await collection.insertOne(newUser);
    return { ...newUser, _id: result.insertedId };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
