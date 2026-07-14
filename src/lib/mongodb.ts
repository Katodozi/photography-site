import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

function readMongoUri(): string | undefined {
  const uri = process.env.MONGODB_URI;
  if (!uri) return undefined;
  return uri.trim().replace(/^["']|["']$/g, '');
}

export function getMongoErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('MONGODB_URI')) return error.message;
    if (error.message.includes('authentication failed')) {
      return 'MongoDB authentication failed. Check your database username and password.';
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      return 'Cannot reach MongoDB. Check your connection string and Atlas network access (allow 0.0.0.0/0).';
    }
    return error.message;
  }
  return 'Database connection failed';
}

export async function connectDB(): Promise<typeof mongoose> {
  const MONGODB_URI = readMongoUri();

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    cached.conn = null;
    throw error;
  }
}
