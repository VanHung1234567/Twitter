import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/Users.request'
export const loginController = (req: Request, res: Response) => {
  res.json({
    message: 'Login succeed'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)

    res.json({
      message: 'Register success',
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'Register failed'
    })
  }
}
