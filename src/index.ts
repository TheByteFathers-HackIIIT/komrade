import { Schema, model, connect } from 'mongoose';
import express, { Request, Response } from 'express';
import Auth, { authVerifyRegistered, authVerifyUnregistered } from './auth';
import Register from './register';
import getUser from './getuser';
import cors from 'cors';
import { KUserUnknown } from './structures';
import { KUserCached } from './sessions';
// import  './getactiveorders';
import newOrder from './neworder';
import GetActiveOrders from './getactiveorders';
const app = express();

const port = 3001;

app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }));  

main();
async function main () {
     let conn =  await connect('mongodb+srv://komrade_backend:7U1xoFPZ10SJWj8K@komradedb.lzf50ol.mongodb.net/?retryWrites=true&w=majority')
        
     app.use(express.json());

app.get('/auth',Auth);
app.post('/register',authVerifyUnregistered,Register);
app.get('/getactiveorders',authVerifyRegistered,GetActiveOrders);
app.post('/neworder',authVerifyRegistered,newOrder);
app.get('/getuser',authVerifyRegistered,getUser);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 
}

export function unauthorized(res: Response){
    res.status(400).end("Unauthorized");
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: KUserCached;
    }
}
