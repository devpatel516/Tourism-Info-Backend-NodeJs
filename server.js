const app = require('./app.js');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const DB = process.env.DATABASE.replace('<password>',process.env.DATABASE_PASSWORD);
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
const port=3000;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});