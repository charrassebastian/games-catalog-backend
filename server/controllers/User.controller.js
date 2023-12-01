const User = require('../models/User.schema')
const jwt = require('jsonwebtoken')

/**
 * Controller for performing the login
 * When successful returns the jwt with the info of the user
 */
module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            const error = "The username or the password was not present in the request"
            res.status(401).json({ status: 'error', error })
        } else {
            
            const filter = { username, password }
            const user = await User.findOne(filter)
            if (user) {
                const token = jwt.sign({ username, password }, process.env.JWT_SECRET)
                res.json({ status: 'ok', token })
            } else {
                const error = 'The user could not be found'
                res.status(401).json({ status: 'error', error })
            }
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error })
    }
}
