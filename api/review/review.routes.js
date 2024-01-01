import express from 'express'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

import { addReview, getReviews, deleteReview, updateReview } from './review.controller.js'
export const reviewRoutes = express.Router()

reviewRoutes.get('/', getReviews)
reviewRoutes.post('/edit', log, requireAuth, addReview)
reviewRoutes.put('/edit/:reviewId', log, requireAuth, updateReview)
reviewRoutes.delete('/:reviewId', requireAuth, deleteReview)

