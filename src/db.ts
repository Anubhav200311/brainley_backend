import { connect } from "mongoose";
import { MONGO_URI } from "./config";

const connectToDatabase = async () => {

    try{
        await connect(MONGO_URI);
        console.log("Connected to Brainly DataBase");
    }catch(e){
        console.log("Failed to connect " , e);
        process.exit(1);
    }
}

export default connectToDatabase;