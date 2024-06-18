const express = require("express");
const path = require("path");
const {logger, logEvents} = require("./middleware/logEvents")
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const errorHandler = require("./middleware/ErrorHandler");


// external  middleware
const whiteList = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        // origin = '*';
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    }
}
app.use(cors(corsOptions));
// custome middle ware 
app.use(logger);

// built in middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get("/", (req, res,next) => {
    res.send("Hello World");
    console.log("2nd middleware");
    // next()
});
app.get('/*',(req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'views/subdir','404.html'))
})

app.use(errorHandler)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));