import { MongoClient } from 'mongodb'
import { backendLoggerService } from './backend.logger.service.js'
import { config } from '../config/index.js'

export const dbService = {
    getCollection
}

var dbConn = null

async function getCollection(collectionName) {

    try {
        const db = await _connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        backendLoggerService.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(config.dbURL)
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        backendLoggerService.error('Cannot Connect to DB', err)
        throw err
    }
}