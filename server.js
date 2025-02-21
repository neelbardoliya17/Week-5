process.on('uncaughtException',(error)=>{
  console.log("Uncaught Exception:",error.message);
  console.log(error.stack);
  process.exit(1);
});

process.on('unhandledRejection',(reason,promise)=>{
  console.log(reason);
  console.log(`Unhandle Promise rejection`,promise);
  process.exit(1);
})
      
require('dotenv').config();
const express=require('express');
// const {loggerInfo,authenticateUser}=require('./middlewares/userMiddleware');
const userRoutes=require('./routes/userRoutes');

const app=express()

app.get('/',(req,res)=>{
  res.send('Welcome to home page');
}); 

//TRIGGGER THE GLOBAL LEVEL EXCEPTIOn

// console.log(x);
// const asyncFunction = async () => {
//     throw new Error("Error occurred!");
//   };
//   asyncFunction();


// app.use(loggerInfo);
app.use(express.json());
app.use('/users',userRoutes);

app.listen(process.env.PORT || 3000,()=>{
  console.log(`Server running on this port ${process.env.PORT}`);
})









































// const redis = require("redis");

// const client = redis.createClient({
//   url: "redis://default:sM225z4yqeA9cswxzgsTQ8btr2kSQXtF@redis-10141.c305.ap-south-1-1.ec2.redns.redis-cloud.com:10141",
// });

// client.on("error", (error) => {
//   console.log("Redis client error", error.message);
// });

// async function connectRedis() {
//   await client.connect();
//   console.log("Connected to redis cloud");
// }

// async function operation() {
//   await client.set("myKey", "Hello");
//   const value = await client.get("myKey");
//   console.log("Stored value:", value);
// }

// async function closeConnection() {
//   await client.disconnect();
//   console.log("Disconnected to redis cloud");
// }

// connectRedis()
//   .then(operation)
//   .then(closeConnection)
//   .catch((error) => {
//     console.log("Error in promise:", error.message);
//   });
