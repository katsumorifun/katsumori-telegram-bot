import mongoose from 'mongoose';
import * as dotenv from 'dotenv'

dotenv.config()

async function run() {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}/bot?retryWrites=true&w=majority`);
}  


run().catch(err => console.log(err));


export default mongoose;