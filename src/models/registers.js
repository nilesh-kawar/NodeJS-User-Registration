const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
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
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})
// generating tokens 
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (err) { 
        // res.send("Error: "+err);
        console.log("Error Occured: "+err);
    }
}
// Converting into hash 
// employeeSchema.pre("save", async function(next){
//     if(this.isModified){
//         console.log("!!!!!---> "+this.password);
//         this.password =  await bcrypt.hash(this.password, 5);
//         console.log("!!!!!---> "+this.password);

//         // this.cpassword = await bcrypt.hash(this.password, 5);
//     }
//     next();
// })

const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;