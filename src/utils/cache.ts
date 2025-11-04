import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
}

const memoryCache = new Map<string, any>();

export async function cacheGet(key: string): Promise<any | null> {
  if (redis) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } else {
    return memoryCache.get(key) || null;
  }
}

export async function cacheSet(key: string, value: any, ttlSeconds = 3600) {
  if (redis) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } else {
    memoryCache.set(key, value);
    setTimeout(() => memoryCache.delete(key), ttlSeconds * 1000);
  }
}
