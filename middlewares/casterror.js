const castError = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }
    next(error)
}

module.exports = castError