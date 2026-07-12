const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require('./config/redis');
const problemRouter = require("./routes/problemCreator");
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aiChatting")
const videoRouter = require("./routes/videoCreator");

const userProfileRouter = require('./routes/userProfile');
const cors = require('cors')
const helmet = require("helmet");

const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true 
}))

app.use(express.json());
app.use(cookieParser());
app.use(helmet());


//rate limiting
app.use(apiLimiter); // Apply to all routes
app.use("/user", authLimiter, authRouter); 


app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);


app.use('/user', userProfileRouter);

const InitalizeConnection = async ()=>{
     try{
        await main();
        console.log("MongoDB Connected Successfully");
        
        try{
            await redisClient.connect();
            console.log("Redis Connected Suceessfully");
        }
        catch(err){
            console.log("Redis not available. Starting without Redis");
        }
        
        app.listen(process.env.PORT || 5000, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })

    }
    catch(err){
        console.log("Error: "+err);
    }

}


InitalizeConnection();

