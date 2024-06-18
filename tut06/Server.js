const express = require("express");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3500;
const app = express();

app.get('^/$|/index(.html)?',(req, res)=>{
    // res.send("Hello World");
    res.sendFile(path.join(__dirname, 'views/subdir','index.html'))   
})
app.get('/new-page',(req, res)=>{
    // res.send("Hello World");
    res.sendFile(path.join(__dirname, 'views/subdir','new-page.html'))   
})

// redirect the page to new one if the user send get request to /old-page
app.get('/old-page(.html)?',(req, res)=>{
    // res.send("Hello World");
    console.log(res.statusCode);
    res.statusCode(301).redirect(301,'/new-page')})


// 404 page default page if the route lose other urls it fal back to default


//  route chaining
app.get('/old-pages(.html)?',(req, res, next)=>{
    console.log(" attempting to access old page ");
    next()
}, (req,res)=>{
    console.log("access new page");
})

const one = (req, res, next)=>{
    console.log("one")
    next()
}
const two = (req, res, next)=>{
    console.log("two")
    next()
}
const three = (req, res)=>{
    console.log("three")
    res.send("finished chaining ...")
}

app.get('/chain(.html)?', [one, two, three])

app.get('/*',(req, res)=>{
    res.status(404).sendFile(path.join(__dirname, 'views/subdir','404.html'))
})
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))