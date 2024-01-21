import { RefType } from "mongoose";
import { KUserUnknown } from "./structures"
import crypto from 'crypto';
const validity=1000;
export type KUserCached = {
    expires: number
} & KUserUnknown;
const cache = new Map<string, KUserCached>(); 
export function genUserSession(user: KUserUnknown){
    let key = crypto.randomBytes(32).toString('hex');
    cache.set(key,{
        ...user, expires: Date.now() / 1000 + validity
    });
    return key;
}

export function getUserSession(key: string){
    return cache.get(key);
}

export function updateSession(key: string, user: KUserCached){
    cache.set(key,user);
};