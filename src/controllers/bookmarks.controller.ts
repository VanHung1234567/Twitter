import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import tweetsService from '~/services/tweets.services'
import { TokenPayload } from '~/models/requests/Users.request'
import { BookmarkTweetReqBody } from '~/models/requests/Bookmark.request'
import bookmarkService from '~/services/bookmarks.service'
import { BOOKMARK_MESSAGES } from '~/constants/messages'

export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetReqBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweet(user_id, req.body.tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGES.BOOKMARK_SUCCESSFULLY,
    result
  })
}

export const unbookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  await bookmarkService.unbookmarkTweet(user_id, req.params.tweet_id)
  return res.json({
    message: BOOKMARK_MESSAGES.UNBOOKMARK_SUCCESSFULLY
  })
}
