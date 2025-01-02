import { Router } from 'express'
import { uploadImageController, uploadVideoController } from '~/controllers/medias.controllers'
import { accessTokenValidator, verfiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

const mediaRouter = Router()

mediaRouter.post('/upload-image', accessTokenValidator, verfiedUserValidator, wrapRequestHandler(uploadImageController))
mediaRouter.post('/upload-video', accessTokenValidator, verfiedUserValidator, wrapRequestHandler(uploadVideoController))

export default mediaRouter
