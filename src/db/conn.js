const mogoose = require('mongoose');
mogoose.connect("mongodb://localhost:27017/loginRegister", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connection Sucessfull');
}).catch((err) => {
    console.log('Error Occured '+err);
})