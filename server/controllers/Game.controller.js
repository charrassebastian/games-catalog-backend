const Game = require('../models/Game.schema')
const User = require('../models/User.schema')
const jwt = require('jsonwebtoken')

/**
 * Controller for adding a game to the database
 */
module.exports.saveGame = async (req, res) => {
    try {        
        if (!req.headers?.authentication) {
            const error = "Encabezado de autenticación no encontrado en la solicitud"
            res.status(401).json({ status: 'error', error })
        } else {
            const { username, password } = await jwt.verify(req.headers.authentication, process.env.JWT_SECRET)
            const filter = { username, password }
            const user = User.findOne(filter)
            if (!user) {
                const error = "Usuario no encontrado"
                res.status(401).json({ status: 'error', error })
            } else {
                const game = new Game(req.body.game)
                const savedGame = await game.save()
                if (savedGame) {
                    res.json({ status: 'ok' })
                } else {
                    const error = 'El juego no se pudo guardar'
                    res.status(500).json({ status: 'error', error })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error })
    }
}

/**
 * Controller for editing a game given its id
 */
module.exports.updateGame = async (req, res) => {
    try {
        if (!req.headers?.authentication) {
            const error = "Encabezado de autenticación no presente en la solicitud"
            res.status(401).json({ status: 'error', error })
        } else {
            const { username, password } = await jwt.verify(req.headers.authentication, process.env.JWT_SECRET)
            const filter = { username, password }
            const user = User.findOne(filter)
            if (!user) {
                const error = "Usuario no encontrado"
                res.status(401).json({ status: 'error', error })
            } else {
                const game = await Game.findOneAndUpdate({ _id: req.query.id }, req.body.game)
                if (game) {
                    res.json({ status: 'ok' })
                } else {
                    const error = "Juego con id " + req.query.id + " no encontrado"
                    res.status(500).json({ status: 'error', error })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error })
    }
}

/**
 * Controller for retrieving a game by its ID
 */
module.exports.getGame = async (req, res) => {
    try {
        const filter = { _id: req.query.id }
        const game = await Game.findOne(filter)
        if (game) {
            res.json({ status: 'ok', game })
        } else {
            const error = 'El juego no pudo ser encontrado'
            res.status(500).json({ status: 'error', error })
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error })
    }
}

/**
* Controller for deleting a game given its id
*/
module.exports.deleteGame = async (req, res) => {
    try {
        if (!req.headers?.authentication) {
            const error = "Encabezado de autenticación no presente en la solicitud"
            res.status(401).json({ status: 'error', error })
        } else {
            const { username, password } = await jwt.verify(req.headers.authentication, process.env.JWT_SECRET)
            const filter = { username, password }
            const user = User.findOne(filter)
            if (!user) {
                const error = "Usuario no encontrado"
                res.status(401).json({ status: 'error', error })
            } else {
                const game = await Game.findOneAndDelete({ _id: req.query.id })
                if (game) {
                    res.json({ status: 'ok' })
                } else {
                    const error = "Juego con id " + req.query.id + " no encontrado"
                    res.status(500).json({ status: 'error', error })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error })
    }
}