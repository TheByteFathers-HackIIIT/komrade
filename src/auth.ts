import {NextFunction, Request, Response, urlencoded } from 'express';
import { KUser, KUserUnknown, UserModel, getUserByEmail } from './structures';
import axios from 'axios';
import { parseString, parseStringPromise } from 'xml2js';
import { unauthorized } from '.';
import { KUserCached, genUserSession, getUserSession } from './sessions';
type Params = {
 ticket?: string
}
const WEBURL = "http://10.2.130.252:5173/"
const SERVICE_URL = WEBURL+"cas";
const BASE_URL = "https://login.iiit.ac.in/cas/p3/serviceValidate";
export async function getCASinfo(ticket: string): Promise<KUserUnknown | null>{
    let x: URL = (new URL(BASE_URL));
    x.searchParams.append("service",SERVICE_URL);
    x.searchParams.append("ticket",ticket);
    let parsed = (await parseStringPromise((await axios.get(x.href)).data))["cas:serviceResponse"]['cas:authenticationSuccess'];
    // console.log(parsed);
    if(!parsed)
    return null; //authsuccess property does not exist, hence user does not exist.
    parsed = parsed[0]["cas:attributes"][0];
    // console.log(JSON.stringify(parsed));
    return {
        email: parsed["cas:E-Mail"][0],
        //@ts-ignore
        firstname: parsed["cas:FirstName"][0],
        name: parsed["cas:Name"][0],
        registered: false
    }
}
export default async function Auth(req: Request, res: Response){
    let params = req.query as Params;
    // req.params
    let User : KUserUnknown | null;
    let userinit: KUserUnknown | null;
    if(params.ticket){
        userinit = (await getCASinfo(params.ticket));
        console.log(userinit);
        if(userinit==null)
        unauthorized(res);
        else{
        User = await getUserByEmail(userinit.email);
        if(User)
        userinit = {...User, registered: true } as KUserUnknown;
        let seshkey = genUserSession(userinit);
        res.contentType('json');

        res.end(JSON.stringify({...userinit,seshkey}));
        }
    } else {
        authVerifyUnregistered(req,res,()=>{
            res.end(JSON.stringify(req.user));
        });
    }
}


export async function authVerifyUnregistered(req: Request, res: Response, next: NextFunction){
        let key: any, email: any;
        if((key = req.headers["seshkey"]) && (email=req.headers["email"])){
                 let sesh = getUserSession(key);
                 if(sesh && sesh.email == email && sesh.expires>Date.now()/1000) 
                 {
                        req.user = sesh as KUserCached;
                        next();
                        return;
                 }
        }
        unauthorized(res);
}

export async function authVerifyRegistered(req: Request, res: Response, next: NextFunction){
    let key: any, email: any;
    if((key = req.headers["seshkey"]) && (email=req.headers["email"])){
             let sesh = getUserSession(key);
             if(sesh && sesh.registered && sesh.email == email && sesh.expires>Date.now()/1000) 
             {
                    req.user = sesh as KUserCached;
                    next();
                    return;
             }
    }
    unauthorized(res);
}