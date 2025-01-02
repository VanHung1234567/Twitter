import express from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/medias.routers'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_IMAGE_DIR } from './constants/dir'
import staticRouter from './routes/static.routers'

config()
const app = express()
const port = process.env.PORT || 4000
console.log(process.argv)
//Tạo folder upload
initFolder()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/static', staticRouter)
// app.use('/static', express.static(UPLOAD_IMAGE_DIR))

databaseService.connect()
app.use(defaultErrorHandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
