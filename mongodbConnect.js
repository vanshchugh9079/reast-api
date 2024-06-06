import mongoose from "mongoose";
let dbconnect=async()=>{
    try{
        await mongoose.connect("mongodb+srv://vanshch9079:chughv9079@firstcluster.qgf2muq.mongodb.net/")
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

export default dbconnect;