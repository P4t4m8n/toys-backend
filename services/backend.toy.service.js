
import fs from 'fs'
import { backendUtilService } from './backend.util.service.js'

export const backendToyService = {
    query,
    getById,
    remove,
    save,
}

const gToys = backendUtilService.readJsonFile('data/toy.json')

// const PAGE_SIZE = 10

function query(filterSortBy) {

    const { name, inStock, byLabel, sortBy } = filterSortBy

    var toys = gToys

    if (name) {
        const regex = new RegExp(name, 'i')
        toys = toys.filter(toy => regex.test(toy.name))
    }

    if (inStock === 'inStock') {
        toys = toys.filter(toy => toy.inStock)
    }

    if (inStock === 'notInStock') {
        toys = toys.filter(toy => !toy.inStock)
    }

    if (byLabel) {
        byLabel.forEach(label => {
            toys.filter(toy => { toy.labels.some(label) })
        })
    }

    if (sortBy === 'price') {
        toys.sort((toyA, toyB) => toyA.price - toyB.price)
    }
    if (sortBy === 'createdAt') {
        toys.sort((toyA, toyB) => toyA.createdAt - toyB.createdAt)
    }

    if (sortBy === 'name') {
        toys.sort((toyA, toyB) => toyA.name.localeCompare(toyB.name))
    }

    return Promise.resolve(toys)
}

function save(toy) {
    if (toy._id) {
        const idx = gToys.findIndex(currToy => currToy._id === toy._id)
        if (idx === -1) return Promise.reject('No such toy')
        gToys[idx] = toy
    } else {
        toy._id = backendUtilService.makeId()
        gToys.push(toy)
    }

    return _savetoysToFile().then(() => toy)
}

function getById(toyId) {
    const toy = gToys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId,) {
    const idx = gToys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')

    gToys.splice(idx, 1)
    return _savetoysToFile()
}


function _savetoysToFile() {
    // console.log('gToys:', gToys)
    return new Promise((resolve, reject) => {
        fs.writeFile('data/toy.json', JSON.stringify(gToys, null, 2), (err) => {
            if (err) {
                console.log(err)
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })
}