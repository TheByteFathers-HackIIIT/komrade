import { Request, Response } from "express";
import { KUserCached } from "./sessions";
import { OrderModel } from "./structures";
import { unauthorized } from ".";
type OrderRequest = { 
    items: String[],
    canteen: String
}
export default async function newOrder(req: Request,res: Response){
    let order = req.body as OrderRequest;
    if(!order.items  || !order.canteen || !req.user){
        res.status(400).send("Bad Request");
        return;
    }
    console.log(order.items);
    //expiry time in current seconds + expire inteerval, must be less than 1 hr

    let orderer = req.user as KUserCached;
    let orderobj = new OrderModel({hostel: orderer.hostel,   ordererNumber:orderer.phone, ordererEmail: orderer.email, items: order.items, expire: 0, canteen: order.canteen, timestamp: Date.now()/1000, completed: false});
    
    await orderobj.save();
    res.send("Success!");
}

export async function orderAccept(req: Request,res: Response){
    let x = req.body.id;
    let order = await OrderModel.findById(x);
    let user = req.user;
    if(!order || !user ){
    unauthorized(res);
    return;}
    order.completed = true;

    order.delivererEmail = (user as KUserCached).email;
    order.delivererNumber = (user as KUserCached).phone;
    await order.save();
    res.send("Success!");
}