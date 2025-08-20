const fs=require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./model/tourModel');
mongoose
.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log('DB connection successful!');
}).catch(err => {
    console.error('DB connection error:', err);
});
const tours=JSON.parse(fs.readFileSync(`./dev-data/data/tours-simple.json`,'utf-8'));
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.error(err);
    }
    process.exit();
}
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.error(err);
    }
    process.exit();
}

if(process.argv[2] === '--import') {
    importData();
}
else if(process.argv[2] === '--delete') {
    deleteData();
}