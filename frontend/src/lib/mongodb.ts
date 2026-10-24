import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/unicredit_db";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  isConnected: boolean;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  isConnected: false,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<{ isConnected: boolean; error?: string }> {
  if (cached.conn && cached.isConnected) {
    return { isConnected: true };
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500, // Quick timeout to prevent UI hanging if MongoDB is offline
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((m) => {
        cached.isConnected = true;
        console.log("✅ [MongoDB] Kết nối cơ sở dữ liệu thành công:", MONGODB_URI);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        cached.isConnected = false;
        console.warn("⚠️ [MongoDB] Không thể kết nối tới MongoDB (" + err.message + "). Hệ thống sẽ dùng bộ dữ liệu mô phỏng trong bộ nhớ.");
        return null as unknown as typeof mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
    return { isConnected: !!cached.conn && cached.isConnected };
  } catch (err: unknown) {
    cached.promise = null;
    cached.isConnected = false;
    const msg = err instanceof Error ? err.message : String(err);
    return { isConnected: false, error: msg };
  }
}

export default connectToDatabase;
