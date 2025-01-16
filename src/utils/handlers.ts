import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler = <P>(
  func: (req: Request<P, any, any, any>, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
