import mongoose from "mongoose";

const connectDb = async () => {
    try{
        const connection = await mongoose.connect(
            process.env.MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log(`MongoDB conected en: ${url}`);
    }catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

export default connectDb;