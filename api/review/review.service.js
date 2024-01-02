import { asyncLocalStorage } from '../../services/als.service.js'
import mongodb from 'mongodb'
import { backendLoggerService } from '../../services/backend.logger.service.js'
import { dbService } from '../../services/db.service.js'
const { ObjectId } = mongodb

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('review')
        // var reviews = await collection.find({})
        // const reviews = await collection.find(criteria).toArray()
        var reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $addFields: {
                    userObjId: { $toObjectId: '$userId' },
                    toyObjId: { $toObjectId: '$toyId' },
                },
            },
            {
                $lookup: {
                    localField: 'userObjId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup: {
                    localField: 'toyObjId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'byToy'
                }
            },
            {
                $unwind: '$byToy'
            }
        ]).toArray()

        reviews.map(review => {
            review.toy = { _id: review.toyId, name: review.byToy.name, price: review.byToy.price },
                review.user = { _id: review.userId, username: review.byUser.username },
                review.content = review.txt,

                delete review.txt
            delete review.byUser
            delete review.byToy
            delete review.userId
            delete review.toyId
            delete review.userObjId
            delete review.toyObjId
        })


        return reviews
    } catch (err) {
        backendLoggerService.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId, user) {
    try {
        const collection = await dbService.getCollection('review')
        // remove only if user is owner/admin
        const criteria = { _id: new ObjectId(reviewId) }
        if (!user.isAdmin) criteria.userId = user._id
        console.log("criteria:", criteria)
        const { deletedCount } = await collection.deleteOne(criteria)

        return deletedCount
    } catch (err) {
        backendLoggerService.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {

        const reviewToAdd = {
            toyId: review.toyId,
            userId: review.userId,
            txt: review.txt
        }
        const reviewToReturn = {
            toy: { _id: review.toyId, name: review.toy.name, price: review.toy.price },
            user: { _id: review.userId, username: review.user.username },
            content: review.txt
        }

        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        reviewToAdd.toy = { _id: review.toyId, name: review.toy.name, price: review.toy.price }
        reviewToAdd.user = { _id: review.userId, username: review.user.username }
        reviewToAdd.content = reviewToAdd.txt

        delete reviewToAdd.toyId
        delete reviewToAdd.userId
        delete reviewToAdd.txt

        return reviewToAdd
    } catch (err) {
        backendLoggerService.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.toyId) criteria.toyId = filterBy.toyId
    if (filterBy.username) criteria.username = filterBy.username
    return criteria
}

export const reviewService = {
    query,
    remove,
    add
}


