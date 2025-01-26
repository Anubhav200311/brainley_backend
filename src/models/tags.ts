import { model , Schema , ObjectId, Model } from "mongoose";


interface ITags {
    _id : ObjectId;
    title : string;
}



const tagsSchema = new Schema<ITags>({
    title : { type: String , required : true , unique : true }
});

const TagsModel = model('Tags' , tagsSchema);


module.exports = TagsModel;