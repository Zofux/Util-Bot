module.exports = async () => {
    const mongoose = require('mongoose')
    await mongoose.connect(process.env.database || '', {
        keepAlive: true,
    })
    if (mongoose.connect) {
        console.log("Connected to Database")
    }
}