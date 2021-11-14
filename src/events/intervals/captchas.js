module.exports = async (client) => {
    const checkCaptchas = async () => {
        const schema = require('../../models/captchas');
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
        setTimeout(checkCaptchas, 1000 * 60)
    }
    checkCaptchas()
}