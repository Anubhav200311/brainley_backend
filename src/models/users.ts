import { Schema, model, connect, ObjectId } from 'mongoose';


interface IUser {
    _id : ObjectId;
    username : string;
    password : string;
}


const userSchema = new Schema<IUser>({
    // _id : {type : Schema.Types.ObjectId , required : true},
    username : {type : String , required: true , unique: true},
    password : {type : String , required: true}
})

export const UserModel = model<IUser>('User' , userSchema)

module.exports = {
    UserModel
}

