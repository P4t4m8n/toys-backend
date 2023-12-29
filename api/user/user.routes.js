import express from 'express'

import { getUser, getUsers, deleteUser, updateUser } from './user.controller.js'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'

export const userRoutes = express.Router()

// muserIddleware that is specific to this router
// userRoutes.use(requireAuth)

userRoutes.get('/:userId', getUser)
userRoutes.put('/:userId', updateUser)

// userRoutes.get('/', requireAuth, requireAdmin, getUsers)
userRoutes.get('/', getUsers)
userRoutes.put('/:userId', requireAuth, requireAdmin, updateUser)
userRoutes.delete('/:userId', requireAuth, requireAdmin, deleteUser)
