const personaRouter = require('express').Router()
const Persona = require('../models/persona')

personaRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(personas => {
            response.json(personas)
        })
})

personaRouter.post('/', (request, response) => {
    const persona = new Persona(request.body)

    persona
        .save()
        .then(result => {
            response.status(201).json(result)
        })
        .catch(error => next(error))
})

module.exports = personaRouter