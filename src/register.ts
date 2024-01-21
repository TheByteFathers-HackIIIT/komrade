import {NextFunction, Request, Response, urlencoded } from 'express';
import { KUser, addUser } from './structures';
import { KUserCached, genUserSession, getUserSession, updateSession } from './sessions';
import { unauthorized } from '.';
type RegInfo = {
    hostel: KUser["hostel"],
    room: string,
    phone: string
};
export default async function Register(req: Request, res: Response) {
    let requestdata = req.body as RegInfo;
    let key = req.headers["seshkey"] as string;
    if(!requestdata.hostel || !requestdata.room || !requestdata.phone || !key){
        res.status(400).send("Bad Request");
        return;
    } 
    let user = getUserSession(key) as (KUser & KUserCached);
    if(!user || user.registered){
        unauthorized(res);
        return;
    }
    user.registered=true;
    updateSession(key,user);
    await addUser({...requestdata,email: user.email, "name": user.name, "firstname": user.firstname, orders: []});
    res.status(200).send("Success!");
}