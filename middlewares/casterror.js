const castError = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

module.exports = castError