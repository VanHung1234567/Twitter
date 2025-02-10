import express from 'express'
import usersRouter from '~/routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediaRouter from './routes/medias.routers'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import { UPLOAD_VIDEO_DIR } from './constants/dir'
import staticRouter from './routes/static.routers'
import tweetsRouter from './routes/tweets.routes'
import bookmarksRouter from './routes/bookmarks.routes'
import likesRouter from './routes/likes.routes'
import searchRouter from './routes/search.routes'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
// import '~/utils/fake'
import '~/utils/s3'
import Conversation from './models/schemas/Conversations.schema'
import conversationsRouter from './routes/conversations.routes'
import { ObjectId } from 'mongodb'
import { verifyAccessToken } from './utils/common'
import { TokenPayload } from './models/requests/Users.request'
import { UserVerifyStatus } from './constants/enums'
import { ErrorWithStatus } from './models/Errors'
import { USERS_MESSAGES } from './constants/messages'
import HTTP_STATUS from './constants/httpStatus'

config()
databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexFollowers()
  databaseService.indexTweets()
})
const app = express()
const httpServer = createServer(app)
const port = process.env.PORT || 4000
console.log(process.argv)

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

//Tạo folder upload
initFolder()

app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarksRouter)
app.use('/likes', likesRouter)
app.use('/search', searchRouter)
app.use('/conversations', conversationsRouter)
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

const users: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.use(async (socket, next) => {
  const { Authorization } = socket.handshake.auth
  const access_token = Authorization?.split(' ')[1]
  try {
    const decoded_authorization = await verifyAccessToken(access_token)
    const { verify } = decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    socket.handshake.auth.decoded_authorization = decoded_authorization
    next()
  } catch (error) {
    next({
      message: 'Unauthorized',
      name: 'UnauthorizedError',
      data: error
    })
  }
})

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`)
  const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
  users[user_id] = { socket_id: socket.id }
  socket.on('send_message', async (data) => {
    const { sender_id, receiver_id, content } = data.payload
    const receiver_socket_id = users[receiver_id]?.socket_id

    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id as string),
      receiver_id: new ObjectId(receiver_id as string),
      content: content
    })

    const result = await databaseService.conversations.insertOne(conversation)
    conversation._id = result.insertedId
    if (receiver_socket_id) {
      socket.to(receiver_socket_id).emit('receive_message', {
        payload: conversation
      })
    }
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`user ${socket.id} disconnect`)
    console.log(users)
  })
})

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
