const express = require('express');
const AppError = require('./utils/appError');
const tourRouter = require('./routes/tourRouter');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp=require('hpp'); 
const userRouter = require('./routes/userRouter');
const globalErrorHandler = require('./controllers/errorController');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
const limiter = rateLimit({
    max: 100, // limit each IP to 100 requests per windowMs
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter); // Apply rate limiting to all API routes
app.use(helmet()); // Set security HTTP headers
app.use(express.json({limit: '10kb'})); // Limit JSON body size to 10kb


//data sanitization against NoSQL injection attacks
app.use(mongoSanitize()); // Sanitize data against NoSQL injection attacks

//data sanitization against XSS attacks
app.use(xss()); // Uncomment if you want to use xss-clean for XSS protection
app.use(hpp(
    {
        whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'maxGroupSize', 'difficulty', 'price'] // Specify query parameters to allow
    }
)); // Prevent HTTP Parameter Pollution
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res,next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
