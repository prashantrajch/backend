const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() =>{
    console.log('Connected to DB');
}).catch((err) =>{
    console.log(err);
})
