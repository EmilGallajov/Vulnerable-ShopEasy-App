const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://egsec:egsec@shopeasy.ijyha12.mongodb.net/?retryWrites=true&w=majority&appName=shopeasy';
const DB_NAME = 'shopeasy';
const COLLECTION_NAME = 'users';

let client;
let db;

// Initialize MongoDB connection
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

exports.getUserByUsername = async (username) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    const user = await collection.findOne({ username: username });
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
    
    // NoSQL Injection Vulnerability: Execute password query against database
    // This allows attackers to use MongoDB operators to bypass password checks
    const user = await collection.findOne({ 
      id: userId, 
      password: passwordQuery 
    });
    
    return !!user; // Return true if user found, false otherwise
  } catch (error) {
    console.error('Error checking password with query:', error);
    return false;
  }
};

exports.createUser = async (userData) => {
  try {
    const database = await connectToDatabase();
    const collection = database.collection(COLLECTION_NAME);
    
    // Check if user already exists
    const existingUser = await collection.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error('Username already exists');
    }
    
    // Get the next available ID
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