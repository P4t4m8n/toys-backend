import { reviewService } from "./review.service.js"
import { userService } from '../user/user.service.js'
import { backendLoggerService } from "../../services/backend.logger.service.js"


export async function getReviews(req, res) {

    try {
        const reviews = await reviewService.query(req.query)
        console.log("reviews:", reviews)
        res.send(reviews)
    } catch (err) {
        backendLoggerService.error('Cannot get reviews', err)
        res.status(400).send({ err: 'Failed to get reviews' })
    }
}

export async function deleteReview(req, res) {
    try {
        const deletedCount = await reviewService.remove(req.params.id)
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

    try {
        var review = req.body
        review.byUserId = loggedinUser._id
        review = await reviewService.add(review)

        review.toy = await userService.getById(review.toy)

        review.byUser = loggedinUser

        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)

        delete review.aboutUserId
        delete review.byUserId

        // socketService.broadcast({ type: 'review-added', data: review, userId: loggedinUser._id })
        // socketService.emitToUser({ type: 'review-about-you', data: review, userId: review.aboutUser._id })

        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({ type: 'user-updated', data: fullUser, label: fullUser._id })

        res.send(review)

    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(400).send({ err: 'Failed to add review' })
    }
}

