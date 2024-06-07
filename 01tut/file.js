const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname,'data.txt'),'utf8',(err,data)=>{
    if(err) throw err;
    console.log(data);
})

fs.writeFile(path.join(__dirname,'new.txt'), 'fs,os, module export and require, path,join(_dirname, filename)', (err)=>{
    if(err) throw err;
    console.log('done');

    fs.appendFile(path.join(__dirname,'new.txt'),'last line text',(err)=>{
        if(err) throw err;
        console.log('updated');
    })

    fs.rename(path.join(__dirname,'new.txt'),path.join(__dirname,'new1.txt'),(err)=>{
        if(err) throw err;
        console.log('renamed');
    })
})

process.on('uncaughtException',err =>{
    console.log(`Error: ${err.message}`);
})