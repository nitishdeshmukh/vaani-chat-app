import mongoose from "mongoose";

export const  connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("MongoDB connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
  } catch (error) {
    console.log(error);
  }
}
