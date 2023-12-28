import { backendLoggerService } from '../../services/backend.logger.service.js'
import { backendToyService } from './backend.toy.service.js'



export async function getToys(req, res) {
    try {

        const { name, inStock, byLabel, sortBy } = req.query

        const filterSortBy = {
            name,
            inStock,
            byLabel,
            sortBy,
        }

        backendLoggerService.debug('Getting toys', filterSortBy)

        const toys = await backendToyService.query(filterSortBy)
        res.json(toys)

    }
    catch (err) {

        backendLoggerService.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })

    }
}

export async function getToyById(req, res) {

    try {
        const { toyId } = req.params

        const toy = await backendToyService.getById(toyId)
        res.json(toy)

    }
    catch (err) {
        backendLoggerService.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    // console.log("req:", req.body)

    try {

        const toy = {
            name: req.body.name || '',
            price: +req.body.price || 0,
            inStock: req.body.inStock || false,
            labels: req.body.byLabel || [],
        }

        const addedtoy = await backendToyService.add(toy)
        res.json(addedtoy)

    }
    catch (err) {
        backendLoggerService.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    // console.log("req:", req.body)
    // console.log("req:", req.params)

    try {

        // const toy = {
        //     // _id: req.params.toyId,
        //     name: req.body.name || '',
        //     price: +req.body.price || 0,
        //     inStock: req.body.inStock || false,
        //     labels: req.body.byLabel || [],
        //     createAt: req.body.createAt || new Date()
        // }

        const toy = {...req.body}

        const updatedtoy = await backendToyService.update(toy)
        res.json(updatedtoy)

    }
    catch (err) {
        backendLoggerService.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {

    try {
        const { toyId } = req.params

        await backendToyService.remove(toyId)
        res.send()

    }
    catch (err) {

        backendLoggerService.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })

    }
}

export async function addToyMsg(req, res) {

    const { loggedinUser } = req

    try {
        const toyId = req.params._id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
        }

        const savedMsg = await backendToyService.addToyMsg(toyId, msg)
        res.json(savedMsg)

    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToyMsg(req, res) {

    try {
        const toyId = req.params._id
        const { msgId } = req.params

        const removedId = await backendToyService.removetoyMsg(toyId, msgId)
        res.send(removedId)

    } catch (err) {
        backendLoggerService.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}



