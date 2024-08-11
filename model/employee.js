const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName:{type:String, required:true},
    lastName:String,
    refreshToken:String
})

const Employee = mongoose.model('Employee',employeeSchema)

module.exports = Employee; 