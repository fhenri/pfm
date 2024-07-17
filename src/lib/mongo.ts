// Importing mongoose library along with Connection type from it
import mongoose, { Connection } from "mongoose";

// Declaring a variable to store the cached database connection
declare global {
}

let cachedConnection: Connection | null = null;

// Function to establish a connection to MongoDB
export async function connectToMongoDB() {
  // If a cached connection exists, return it
  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }
  try {
    // If no cached connection exists, establish a new connection to MongoDB

    // set the connection options
    const opts = {
      bufferCommands: false,
      maxPoolSize: 150,
      minPoolSize: 30,
      heartbeatFrequencyMS: 10000,
    };

    console.log("establish connection to MongoDB - mongoose driver");
    const cnx = await mongoose.connect(process.env.MONGODB_URI!, opts);
    // Cache the connection for future use
    cachedConnection = cnx.connection;
    // Return the newly established connection
    return cachedConnection;
  } catch (error) {
    // If an error occurs during connection, log the error and throw it
    console.log(error);
    throw error;
  }
}

export async function closeMongoDBConnection() {
    try {
        // If a cached connection exists, close it
        if (cachedConnection) {
          await cachedConnection.close();
          console.log("Closing cached db connection");
        }
    } catch (error) {
        // If an error occurs during connection closure, log the error and throw it
        console.log(error);
        throw error;
    }
}
