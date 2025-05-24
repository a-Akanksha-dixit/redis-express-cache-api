import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createClient } from 'redis';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const redis = createClient({
    url: process.env.REDIS_URL!
});

redis.on('error', (err) => console.log('Redis Client Error', err));

const connectRedis = async () => {
    await redis.connect();
};
connectRedis().catch(console.error);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello Redis with Express and TS');
});


app.post('/set', async (req: Request, res: Response) => {
    const { key, value, ttl = 60 } = req.body;

    if (!key || !value) {
        res.status(400).json({ error: 'Key and value are required' });
        return;
    }

    try {
        await redis.set(key, JSON.stringify(value), { EX: ttl });
        res.json({ message: `Stored key '${key}' with TTL ${ttl}s` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to set value in Redis' });
    }
});


app.get('/get/:key', async (req: Request, res: Response) => {
    const { key } = req.params;

    try {
        const value = await redis.get(key);
        if (value === null) {
            res.status(404).json({ error: 'Key not found' });
            return;
        }
        res.json({ key, value: JSON.parse(value) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get value from Redis' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});