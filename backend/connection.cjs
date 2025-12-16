const { MongoClient } = require('mongodb');
const { default: connectDB } = require('./config/db.cjs');
require('dotenv').config({ path: './config.env' });

// Enhanced connection function with error handling
async function connectToDatabase() {
  if (!process.env.ATLAS_URI) {
    throw new Error('ATLAS_URI environment variable not set');
  }

  const client = new MongoClient(process.env.ATLAS_URI, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  });

  try {
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas');
    return client;
  } catch (err) {
    console.error('Connection to MongoDB failed:', err);
    throw err;
  }
}

// Function to list all collections with additional details
// async function listCollections() {
//   let client;

//   try {
//     // Establish connection
//     // client = await connectToDatabase();
//     client = await connectDB();
//     const db = client.db('healthcare');

//     // Get collections with additional information
//     const collections = await db.listCollections().toArray();

//     if (collections.length === 0) {
//       console.log('No collections found in the healthcare database');
//       return;
//     }

//     console.log('\nCollections in healthcare database:');
//     console.log('---------------------------------');
    
//     // Display collection details
//     collections.forEach((collection, index) => {
//       console.log(`${index + 1}. ${collection.name}`);
//       console.log(`   Type: ${collection.type}`);
//       if (collection.options) {
//         console.log(`   Options: ${JSON.stringify(collection.options)}`);
//       }
//       console.log('---------------------------------');
//     });

//     return collections;
//   } catch (err) {
//     console.error('Error listing collections:', err);
//     throw err;
//   } finally {
//     if (client) {
//       await client.close();
//       console.log('MongoDB connection closed');
//     }
//   }
// }


async function listCollections() {
  let connection;

  try {
    // Establish connection using Mongoose
    connection = await connectDB();
    const db = connection.db;

    // Get collections
    const collections = await db.collections();
    
    if (collections.length === 0) {
      console.log('No collections found in the healthcare database');
      return;
    }

    console.log('\nCollections in healthcare database:');
    console.log('---------------------------------');
    
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.collectionName}`);
      console.log('---------------------------------');
    });

  } catch (err) {
    console.error('Error listing collections:', err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
      console.log('MongoDB connection closed');
    }
  }
}

// Execute
listCollections().catch(console.error);

