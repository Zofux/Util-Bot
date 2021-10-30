module.exports = async (client) => {
    const checkAutoWarns = async () => {
        const schema = require('../../models/autoInfractions');
        const now = new Date()
        const conditional = {
            expires: {
                $lt: now
            }
        }

        const results = await schema.find(conditional)

        if (results) {
            await schema.deleteMany(conditional)
        }
        setTimeout(checkAutoWarns, 1000 * 60)
    }
    checkAutoWarns()
}