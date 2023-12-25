import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'
import cors from 'cors'


import { backendToyService } from './services/backend.toy.service.js'
import { backendLoggerService } from './services/backend.logger.service.js'

const app = express()

// Config the Express App
const corsOptions = {
    origin: [
        'http://127.0.0.1:8080',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        'http://localhost:5173',
    ],
    credentials: true
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// REST API for toys

// Toys LIST
app.get('/api/toy', (req, res) => {

    const { name, inStock, byLabel, sortBy } = req.query


    const filterSortBy = {
        name,
        inStock,
        byLabel,
        sortBy,
    }

    backendToyService.query(filterSortBy)
        .then(toys => {
            res.send(toys)
        })
        .catch((err) => {
            loggerService.error('Cannot get toys', err)
            res.status(400).send('Cannot get toys')
        })
})

// Toy READ
app.get('/api/toy/:toyId', (req, res) => {

    const { toyId } = req.params

    backendToyService.getById(toyId)
        .then(toy => {
            res.send(toy)
        })
        .catch((err) => {
            loggerService.error('Cannot get toy', err)
            res.status(400).send('Cannot get toy')
        })
})

// Toy DELETE
app.delete('/api/toy/:toyId', (req, res) => {

    const { toyId } = req.params

    backendToyService
        .remove(toyId)
        .then(() => res.send('Removed!'))
        .catch((err) => {
            loggerService.error('Cannot remove toy', err)
            res.status(400).send('Cannot remove toy')
        })
})

// Toy CREATE
app.post('/api/toy/edit', (req, res) => {

    const toy = {
        name: req.body.name || '',
        price: +req.body.price || 0,
        inStock: req.body.inStock || false,
        labels: req.body.byLabel || [],
    }

    backendToyService.save(toy)
        .then((addedtoy) => {
            res.send(addedtoy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

// Toy UPDATE
app.put('/api/toy/edit/:toyId', (req, res) => {

    const toy = {
        _id: req.body._id,
        name: req.body.name || '',
        price: +req.body.price || 0,
        inStock: req.body.inStock || false,
        labels: req.body.byLabel || [],
        createAt: req.body.createAt || new Date()
    }

    backendToyService.save(toy)
        .then(savedtoy => {
            res.send(savedtoy)
        })
        .catch((err) => {
            loggerService.error('Cannot save toy', err)
            res.status(400).send('Cannot save toy')
        })
})

// Fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3031

app.listen(PORT, () => {
    console.log(`Server is ready at ${PORT} http://127.0.0.1:${PORT}/`)
})