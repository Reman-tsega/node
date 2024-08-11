const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const authMiddleware = require('./middleware/authMiddleware');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsHandler');
const { default: mongoose } = require('mongoose');

// custom middleware logger
app.use(logger);

app.use(credentials);
// Cross Origin Resource Sharing
app.use(cors(corsOptions));
// built-in middleware for json 


// connect to db
connectDB();

app.use(express.json());
app.use(cookieParser());
//serve static files
// app.use('/', require('./routes/root'));
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh')) // refresh the access token evry time the user send request

app.use(authMiddleware) // verify the access token b4 the ff routs
app.use('/employees', require('./routes/api/employeesRoute'));
app.use('/employee', require('./routes/api/employees'));
app.use('/users', require('./routes/api/user'));


app.use(errorHandler);
const PORT = process.env.PORT || 3500;
// listen to the reques in this port if the db is connected 
mongoose.connection.once('open', ()=>{
    console.log("connected ....");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})