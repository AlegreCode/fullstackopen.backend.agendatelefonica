const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./db/schema')
const castError = require('./middlewares/casterror')
require('./db/connect')

// const requestLogger = (request, response, next) => {
//     console.log('Method:', request.method)
//     console.log('Path:  ', request.path)
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }

app.use(express.json())
// morgan.token('body', (request, response) => {
//     return request.method === 'POST' ? JSON.stringify(request.body) : ''
// })

app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/api/persons', async (request, response) => {
    const persons = await Person.find()
    response.json(persons)
})

app.get('/api/persons/:id', async (request, response, next) => {
    const id = request.params.id
    try {
        const person = await Person.findById(id)
        response.json(person)
    } catch (error) {
        next(error)
    }
})

app.delete('/api/persons/:id', async (request, response, next) => {
    const id = request.params.id
    try {
        await Person.findByIdAndDelete(id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})

app.post('/api/persons', async (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'name or number is missing' })
    }

    const existingPerson = await Person.findOne({ name: body.name })
    if (existingPerson) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = new Person({
      name: body.name,
      number: body.number,
    })
    const savedPerson = await person.save()
    response.json(savedPerson)
})

app.get("/info", async (request, response) => {
    const count = await Person.countDocuments()
    const template = `Phonebook has info for ${count} people <br> ${new Date()}`
    response.send(template)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(castError)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})  