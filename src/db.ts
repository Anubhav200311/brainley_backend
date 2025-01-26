import { connect } from "mongoose";

const MONGO_URI = '';  // 'mongodb' is the container name

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