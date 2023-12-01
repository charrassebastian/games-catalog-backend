const Game = require('../models/Game.schema')

const escapeSpaces = (str, limiter, escapingCharacter) => {
    let escapedSearchString = ""
    let shouldEscapeSpaces = false
    for (let i = 0; i < str.length; i++){
        let c = str[i]
        if (c === limiter) {
            shouldEscapeSpaces = !shouldEscapeSpaces
        } else {
            escapedSearchString += shouldEscapeSpaces && c === ' '  ? escapingCharacter : c
        }
    }
    return escapedSearchString
}

const processTokens = (primordialSearchTokens, escapingCharacter) => primordialSearchTokens.map(token => token.replace(escapingCharacter, " "))

/**
 * Controller for retrieving the saved games
 */
module.exports.getGames = async (req, res) => {
    try {
        const games = await Game.find()
        if (games) {
            let filteredGames = null
            // filter and order the games
            filteredGames = []
            const hasSearchValue = !!req.query.value?.length

            if (hasSearchValue) {
                const searchString = req.query.value
                const escapingCharacter = "@"
                const escapedSearchString = escapeSpaces(searchString, '"', escapingCharacter)
                const primordialSearchTokens = escapedSearchString.split(" ")
                const searchTokens = processTokens(primordialSearchTokens, escapingCharacter)
                
                let filteredGamesSet = new Set()

                searchTokens.forEach(token => {
                    const regexArg = ".*" + token + ".*"
                    const regex = new RegExp(regexArg, "i")
                    games.forEach(game => {
                        if (game.name.match(regex)) {
                            filteredGamesSet.add({ game, priority: 1 })
                        } else if (game.description.match(regex)) {
                            filteredGamesSet.add({ game, priority: 2 })
                        } else if (game.observationsAndSuggestions.match(regex)) {
                            filteredGamesSet.add({ game, priority: 3 })
                        } else if (game.others.match(regex)) {
                            filteredGamesSet.add({ game, priority: 4 })
                        }
                    })
                })
                filteredGamesSet.forEach(filteredGame => filteredGames.push(filteredGame))
            } else {
                filteredGames = games.map(game => ({ game, priority: 1 }))
            }

            const shouldHaveValidatedContent = req.query.onlyValidatedContent === 'true'
            const nonValidOption = "Elegí una opción"
            const shouldFilterByArea = req.query.area?.length && req.query.area !== nonValidOption
            const shouldFilterByPurpose = req.query.purpose?.length && req.query.purpose !== nonValidOption
            const shouldFilterByMarket = req.query.market?.length && req.query.market !== nonValidOption
            const shouldFilterByPublic = req.query.public?.length && req.query.public !== nonValidOption

            if(shouldHaveValidatedContent){
                filteredGames = filteredGames.filter(e => e.game.contentValidation?.length)
            }

            if(shouldFilterByArea){
                filteredGames = filteredGames.filter(e => e.game.area.includes(req.query.area))
            }
            
            if(shouldFilterByPurpose){
                filteredGames = filteredGames.filter(e => e.game.purpose.includes(req.query.purpose))
            }
            
            if(shouldFilterByMarket){
                filteredGames = filteredGames.filter(e => e.game.scope.market.includes(req.query.market))
            }

            if(shouldFilterByPublic){
                filteredGames = filteredGames.filter(e => e.game.scope.public.includes(req.query.public))
            }

            const orderedGamesSet = new Set()
            const orderedGames = []
            for (let i = 1; i <= 4; i++){
                filteredGames
                    .filter(filteredGame => filteredGame.priority === i)
                    .map(filteredGame => filteredGame.game)
                    .forEach(game => orderedGamesSet.add(game))
            }
            orderedGamesSet.forEach(game => orderedGames.push(game))

            res.json({ status: 'ok', games: orderedGames })
        } else {
            const error = 'No se encontraron juegos'
            res.status(500).json({ status: 'error', error })
        }
    } catch (error) {
        res.status(500).json({ status: 'error', error })
    }
}
