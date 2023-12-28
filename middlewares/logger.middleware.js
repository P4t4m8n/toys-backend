import { backendLoggerService } from '../services/backend.logger.service.js'

export async function log(req, res, next) {
    backendLoggerService.info('Req was made', req.route.path)
    next()
}