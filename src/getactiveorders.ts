import { Request, Response } from "express";
import {OrderModel} from './structures';
export default async function GetActiveOrders(req: Request, res: Response) {
    let t= (await OrderModel.find( {completed: false} ));
    console.log(t);
    res.end( JSON.stringify(t) );
    return;
}
