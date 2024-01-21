
import { Schema,InferSchemaType,SchemaTypes,model } from 'mongoose';
const userschema = new Schema({
    firstname: {type: String,required: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    hostel: { type: String, enum: ['bakul','parijaat','obh','kadamb'],required: true},
    room: {type: String, required: true},
    orders: [{ type: SchemaTypes.ObjectId, ref: 'Order' }]
  });
export type KUser = InferSchemaType<typeof userschema>;
export const UserModel = model('User',userschema);

const orderschema = new Schema({
    delivererEmail: { type: String,required: false },
    delivererNumber: { type: String,required: false },
    ordererEmail: { type: String, required: true },
    ordererNumber: { type: String, required: true },
    timestamp: {type: Date,required: true},
    items: {type: [String], required: true},
    expire: {type: Date, required: true},
    completed: {type: Boolean, required: false, default: false},
    canteen: {type: String, required: true}
});
export type KOrder = InferSchemaType<typeof orderschema>;
export const OrderModel = model('Order',orderschema);
export type KUserUnknown = {
    registered: boolean, email: string
} & Partial<KUser>;

export async function getUserByEmail(email: string): Promise<KUserUnknown | null>{
    return  (await UserModel.findOne({email: email}))?.toJSON() as KUserUnknown | null;
}
export async function addUser(user: KUser){
   await UserModel.updateOne(
        { email: user.email }, 
        { $setOnInsert: user },
        { upsert: true }
    );    
}

export async function addOrder(){

}