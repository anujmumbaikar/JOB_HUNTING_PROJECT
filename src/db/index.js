import mongoose from 'mongoose';
import {DB_NAME} from "../constants.js";

export const connectDb = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("Database connected:",connectionInstance.connection.name);
    } catch (error) {
        console.log("Error connecting to database",error);
    }
    
}
