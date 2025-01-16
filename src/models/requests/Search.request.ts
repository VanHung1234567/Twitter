import { Query } from 'express-serve-static-core'
import { Pagination } from './Tweets.request'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enums'

export interface SearchQuery extends Pagination, Query {
  content: string
  media_type?: MediaTypeQuery
  people_follow?: PeopleFollow
}
