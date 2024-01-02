import { reviewService } from "./review.service.js"
import { userService } from '../user/user.service.js'
import { backendLoggerService } from "../../services/backend.logger.service.js"
import { authService } from "../auth/auth.service.js"
import { backendToyService } from "../toy/backend.toy.service.js"


export async function getReviews(req, res) {

    try {
        const reviews = await reviewService.query(req.query)
        res.send(reviews)
    } catch (err) {
        backendLoggerService.error('Cannot get reviews', err)
        res.status(400).send({ err: 'Failed to get reviews' })
    }
}

export async function deleteReview(req, res) {
    const { reviewId } = req.params
    const { loggedinUser } = req
  
    try {
        const deletedCount = await reviewService.remove(reviewId, loggedinUser)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove review' })
        }
    } catch (err) {
        backendLoggerService.error('Failed to delete review', err)
        res.status(400).send({ err: 'Failed to delete review' })
    }
}


export async function addReview(req, res) {

    var { loggedinUser } = req
    var toy = await backendToyService.getById(req.body.toyId)
    try {
        var review = req.body
        review.toy = toy
        review.user = loggedinUser
        review = await reviewService.add(review)

        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)


        // socketService.broadcast({ type: 'review-added', data: review, userId: loggedinUser._id })
        // socketService.emitToUser({ type: 'review-about-you', data: review, userId: review.aboutUser._id })

        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })
        res.send(review)


    } catch (err) {
        backendLoggerService.error('Failed to add review', err)
        res.status(400).send({ err: 'Failed to add review' })
    }
}

export async function updateReview(req, res) { }

