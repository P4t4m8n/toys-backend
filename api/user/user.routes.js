import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getUser, getUsers, deleteUser, updateUser } from './user.controller.js'

export const userRoutes = express.Router()

// middleware that is specific to this router
// userRoutes.use(requireAuth)

userRoutes.get('/:id', getUser)
userRoutes.put('/:id', updateUser)

userRoutes.get('/', requireAuth, requireAdmin, getUsers)
userRoutes.put('/:id', requireAuth, requireAdmin, updateUser)
userRoutes.delete('/:id', requireAuth, requireAdmin, deleteUser)
