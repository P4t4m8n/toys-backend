
import fs from 'fs'
import { ObjectId } from 'mongodb'
import { backendUtilService } from '../../services/backend.util.service.js'
import { dbService } from '../../services/db.service.js'
import { backendLoggerService } from '../../services/backend.logger.service.js'

export const backendToyService = {
    query,
    getById,
    remove,
    add,
    update,
    addToyMsg,
    removeToyMsg
}

async function query(filterSortBy = {}) {
    try {

        const criteria = _buildCriteria(filterSortBy)
        const { sortBy } = filterSortBy

        const collection = await dbService.getCollection('toy')
        var toys = await collection.find(criteria).sort({ [sortBy]: 1 }).toArray()
        return toys
    }
    catch (err) {
        backendLoggerService.error('cannot find toy', err)
        throw err
    }
}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        return toy
    }
    catch (err) {
        backendLoggerService.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    }
    catch (err) {
        backendLoggerService.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)

        return toy

    }
    catch (err) {

        backendLoggerService.error('cannot add toy', err)
        throw err
    }
}

async function update(toy) {
    console.log("toy:", toy)
    try {
        const toyToSave = {
            name: toy.name,
            price: +toy.price,
            inStock: toy.inStock,
            labels: toy.labels,
            createAt: +toy.createAt
        }

        console.log("toyToSave:", toyToSave)
        const collection = await dbService.getCollection('toy')

        await collection.updateOne({ _id: new ObjectId(toy._id) }, { $set: toyToSave })
        return toy

    }
    catch (err) {
        backendLoggerService.error(`cannot update toy ${toy._id}`, err)
        throw err
    }
}

async function addToyMsg(toyId, msg) {
    try {
        msg.id = backendUtilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        backendLoggerService.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        backendLoggerService.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

function _savetoysToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
            if (err) {
                reject('Cannot write to file')
            } else {
                resolve()
            }
        })
    })
}

function _buildCriteria(filterSortBy) {

    const { name, inStock, byLabel, sortBy } = filterSortBy
    console.log("byLabel:", Array.isArray(byLabel))
    const criteria = {}

    if (name) criteria.name = { $regex: filterSortBy.name, $options: 'i' }

    if (inStock === 'inStock') criteria.inStock = { $eq: true }

    if (inStock === 'notInStock') criteria.inStock = { $eq: false }

    if (byLabel) byLabel.forEach(label => criteria.byLabel = { $eq: label })


    console.log("criteria:", criteria)

    return criteria
}



