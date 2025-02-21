const redis = require("redis");

const client = redis.createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

client.on('connect',()=>{
    console.log('Connected to redis cloud');
});


client.on('error',()=>{
    console.log('Redis connection error',error);
});

async function connectRedis()
{
    try {
        await client.connect();
    } catch (error) {
        console.log(`Error connecting to redis`,error.message);
    }
};


connectRedis();

module.exports=client;