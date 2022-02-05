const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    // phone: {
    //     type: Number,
    //     required: true,
    //     unique: true,
    //     value: "123"
    // },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    }
})

const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;