
import dns from "node:dns";
import { MongoClient, Db } from "mongodb";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri =
  process.env.MONGODB_URI ??
  (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD
    ? `mongodb+srv://${encodeURIComponent(process.env.MONGODB_USERNAME)}:${encodeURIComponent(process.env.MONGODB_PASSWORD)}@cluster0.qlb0afk.mongodb.net`
    : "");

if (!uri) {
  throw new Error("Missing MongoDB credentials.");
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;

export async function getDb(name?: string): Promise<Db> {
  const client = await clientPromise;
  return client.db(name || client.options.dbName || "aladdin_lite");
}

export async function pingDatabase(): Promise<{
  ok: boolean;
  message: string;
}> {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    return { ok: true, message: "Connected to MongoDB Atlas successfully." };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}
