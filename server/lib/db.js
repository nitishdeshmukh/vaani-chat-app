import mongoose from "mongoose";

// Function to connect with mongodb database
export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => 
      console.log("Database Connected")
    );

    // no extra options needed in mongoose v6+
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
