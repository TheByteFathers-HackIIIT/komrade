import { KUserCached } from "./sessions";
import { OrderModel } from "./structures";
import { Request, Response } from "express";
export default async function getHistory(req: Request, res: Response) {
if(!req.user){  
    res.status(401).send("Unauthorized");
    return;
}
    let orderer = req.user as KUserCached;
    res.end( JSON.stringify(await OrderModel.find({ $or: [{ ordererEmail: orderer.email }, { delivererEmail: orderer.email }]})));
}