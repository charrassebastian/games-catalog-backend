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
            const error = "El nombre de usuario o la contraseña no estaban presentes en la solicitud."
            res.status(401).json({ status: 'error', error })
        } else {
            
            const filter = { username, password }
            const user = await User.findOne(filter)
            if (user) {
                const token = jwt.sign({ username, password }, process.env.JWT_SECRET)
                res.json({ status: 'ok', token })
            } else {
                const error = 'El usuario no pudo ser encontrado'
                res.status(401).json({ status: 'error', error })
            }
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error })
    }
}