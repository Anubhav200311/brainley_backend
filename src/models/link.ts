import mongoose, { model , Schema , ObjectId, Model } from "mongoose";


interface ILink {
    _id : ObjectId;
    hash : String;
    userId : ObjectId;
}


const LinkSchema =  new Schema<ILink>({ 
    hash : { type : String , required : true },
    userId : { type : mongoose.Types.ObjectId , required : true  , ref: 'User' , unique: true}
});


export const LinkModel = model("Link" , LinkSchema);

