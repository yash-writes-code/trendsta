/**
 * Redis Connection Factory
 *
 * Creates ioredis instances for BullMQ queues and workers.
 * Each Queue/Worker should get its own connection (BullMQ recommendation)
 * because workers use blocking commands that require a dedicated connection.
 *
 * Configured for Upstash Redis (TLS via rediss:// URL).
 */

import IORedis from "ioredis";

export function createRedisConnection(): IORedis {
    const redisUrl = process.env.REDIS_URL;

    if (!redisUrl) {
        throw new Error(
            "REDIS_URL environment variable is required for BullMQ. " +
            "Set it to your Upstash Redis URL (rediss://default:xxx@xxx.upstash.io:6379)"
        );
    }

    return new IORedis(redisUrl, {
        maxRetriesPerRequest: null, // Required by BullMQ workers (blocking commands)
        enableReadyCheck: false,    // Faster startup with managed Redis (Upstash)
    });
}
