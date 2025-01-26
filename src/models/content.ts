import  mongoose , { ObjectId, Schema , model, mongo } from "mongoose";


enum contentTypes {
    "image" ,
    "video",
    "article",
    "audio"
}

interface IContents {
    _id : ObjectId;
    link : string;
    type : string | contentTypes;
    title : string;
    tags : ObjectId;
    userId: ObjectId;
}

const contentSchema = new Schema<IContents>({
    // _id : { type: Schema.Types.ObjectId , required : true },
    link: { type : String },
    type : { type: String , enum: contentTypes, required : true },
    title : {type : String,  required : true },
    tags : [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId : { type : mongoose.Types.ObjectId , ref : 'User' }
})

export const ContentModel = model<IContents>("Content" , contentSchema);

module.exports = {
    ContentModel
}