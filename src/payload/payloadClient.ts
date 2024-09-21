import config from './payload.config';
import payload, { Payload } from 'payload';
process.env.PAYLOAD_SECRET = 'h7FtP2wE9lRvY1gA3sB6zQ8x';
if (!process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET environment variable is missing');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 *
 * Source: https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
 */
let cached: {
  client: Payload | null;
  promise: Promise<Payload> | null;
} = (global as any).payload;

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null };
}

export const getPayloadClient = async (): Promise<Payload> => {
  if (cached.client) {
    return cached.client;
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      // Make sure that your environment variables are filled out accordingly
      secret: process.env.PAYLOAD_SECRET as string,
      config: config,
      local: true,
    });
  }

  try {
    cached.client = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.client;
};

export default getPayloadClient;
