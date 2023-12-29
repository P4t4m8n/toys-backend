import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getToys, getToyById, addToy, updateToy, removeToy, addToyMsg, removeToyMsg } from '../toy/toy.controller.js'

export const toyRoutes = express.Router()



// middleware that is specific to this router
// router.use(requireAuth)

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:toyId', getToyById)
toyRoutes.post('/edit', requireAuth, requireAdmin, addToy)
toyRoutes.put('/edit/:toyId', requireAuth, requireAdmin, updateToy)
toyRoutes.delete('/:toyId', requireAuth, requireAdmin, removeToy)

toyRoutes.post('/:toyId/msg', requireAuth, addToyMsg)
toyRoutes.put('/:toyId/msg/:msgId', requireAuth, addToyMsg)
toyRoutes.delete('/:toyId/:msgId', requireAuth, removeToyMsg)

