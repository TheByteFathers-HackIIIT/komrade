import { unauthorized } from ".";
import { getUserByEmail } from "./structures";
import {NextFunction, Request, Response, urlencoded } from 'express';

export default async function getUser(req: Request, res: Response){
    let email = req.query["email"];
    if(!email){
    unauthorized(res);
    return;
    }
    let user = getUserByEmail( email as string )
    //TODO return less info 
    return user;
}