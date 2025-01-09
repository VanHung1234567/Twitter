import { Request, Response } from 'express'
import { TweetRequestBody } from '~/models/requests/Tweets.request'
import { ParamsDictionary } from 'express-serve-static-core'
import tweetsService from '~/services/tweets.services'
import { TokenPayload } from '~/models/requests/Users.request'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTwweet(user_id, req.body)
  return res.json({
    message: 'Create Tweet Successfully',
    result
  })
}
