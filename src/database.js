module.exports = () => {
    const mongoose = require('mongoose')
    mongoose.connect(process.env.database, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log("Connected to the Database"))
}