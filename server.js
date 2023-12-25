import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { backendtoyService } from './services/backend.toy.service.js'
import { backendLoggerService } from './services/backend.logger.service.js'
import { backendUserService } from './services/backend.user.service.js'

const app = express()

// Config the Express App
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// toyS

// list
app.get('/api/toy', (req, res) => {

    const { name, inStock, byLabel, sortBy } = req.query


    const filterSortBy = {
        name,
        inStock,
        byLabel,
        sortBy,
    }

    // if (req.query.pageIdx) filterBy.pageIdx = req.query.pageIdx
    backendtoyService.query(filterSortBy)
        .then(toys => {
            res.send(toys)
        })
})

// read
app.get('/api/toy/:toyId', (req, res) => {

    const { toyId } = req.params

    backendtoyService.getById(toyId)
        .then(toy => {
            res.send(toy)
        })
        .catch(err => {
            console.log('Error:', err)
            res.status(401).send('Cannot get toy')
        })
})

// delete
app.delete('/api/toy/:toyId', (req, res) => {

    const { toyId } = req.params

    backendtoyService
        .remove(toyId)
        .then(() => res.send('Removed!'))
        .catch((err) => {
            console.log('err', err)
            res.status(401).send(err)
        })
})

// create
app.post('/api/toy/edit', (req, res) => {

    const toy = {
        name: req.body.name || '',
        price: req.body.price || 0,
        inStock: req.body.inStock || false,
        labels: req.body.byLabel || [],
    }

    backendtoyService.save(toy)
        .then((addedtoy) => {
            res.send(addedtoy)
        })
        .catch((err) => {
            backendLoggerService.error('unable to save', err)
        })
})

// update
app.put('/api/toy/edit/:toyId', (req, res) => {

    const toy = {
        _id: req.params.toyId,
        name: req.body.name || '',
        price: req.body.price || 0,
        inStock: req.body.inStock || false,
        labels: req.body.byLabel || [],
        createAt: req.body.createAt || new Date()
    }

    backendtoyService.save(toy)
        .then(savedtoy => {
            res.send(savedtoy)
        })
        .catch((err) => {
            backendLoggerService.error('unable to save', err)
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