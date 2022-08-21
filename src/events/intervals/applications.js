module.exports = async (client) => {
    const checkApplications = async () => {
        const schema = require('../../models/currentApplications');
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
        setTimeout(checkApplications, 1000 * 60)
    }
    checkApplications()
}