import mongoose, { Connection } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    )
}

// cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};
let cached: Connection = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
    if (cached.conn) {
        console.log("Using cached db connection");
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 150,
            minPoolSize: 30,
            heartbeatFrequencyMS: 10000,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then(mongoose => {
            console.log("establish connection to MongoDB - mongoose driver");
            return mongoose
        })
    }
    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

    return cached.conn
}

export default dbConnect
