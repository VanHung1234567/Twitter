import { Router } from 'express'
import {
  verifyEmailController,
  loginController,
  logoutController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController,
  updateMeController,
  getProfileController,
  followController,
  unfollowController,
  changePasswordController,
  oauthController,
  refreshTokenController
} from '~/controllers/users.controllers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  fotgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import { UpdateMeReqBody } from '~/models/requests/Users.request'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = Router()

/**
 * Description. Login
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description. OAuth with Google
 * Path: /oauth/google
 * Method: GET
 */

usersRouter.get('/oauth/google', wrapRequestHandler(oauthController))
/**
 * Description. Register a new user
 * Path: /register
 * Method: POST
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * Description. Logout a user
 * Path: /logout
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 *  * Description. Refresh token
 * Path: /refresh-token
 * Method: POST
 * Body: { refresh_token: string }

 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * Description. Verify email when user client click on the link in email
 * Path: /verify-email
 * Method: POST
 * Body: { email_verify_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description. Verify email when user client click on the link in email
 * Path: /resend-verify-email
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description. Submit email to reset password, send email to user
 * Path: /forgot-password
 * Method: POST
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', fotgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description. Verify link in email to reset password
 * Path: /verify-forgot-password
 * Method: POST
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Description. Reset password
 * Path: /reset-password
 * Method: POST
 * Body: { forgot_password_token: string, password: string , confirm_password: string }
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * Description. Get my profile
 * Path: /me
 * Method: GET
 * Header: { Authorization: Bearer <access_token> }
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

/**
 * Description. Update my profile
 * Path: /me
 * Method: PATCH
 * Header: { Authorization: Bearer <access_token> }
 * Body: UserSchema
 */
usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  updateMeValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'username',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateMeController)
)

/**
 * Description. Get user profile
 * Path: /:username
 * Method: GET
 */
usersRouter.get('/:username', wrapRequestHandler(getProfileController))

/**
 * Description. Follow someone
 * Path: /follow
 * Method: POST
 * Header: { Authorization: Bearer <access_token> }
 * Body: { followed_user_id: string }
 */
usersRouter.post(
  '/follow',
  accessTokenValidator,
  verifiedUserValidator,
  followValidator,
  wrapRequestHandler(followController)
)

/**
 * Description. Unfollow someone
 * Path: /follow/user_id
 * Method: DELETE
 * Header: { Authorization: Bearer <access_token> }
 * Body: { followed_user_id: string }
 */
usersRouter.post(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapRequestHandler(unfollowController)
)

/**
 * Description. Change password
 * Path: /change-password
 * Method: PUT
 * Header: { Authorization: Bearer <access_token> }
 * Body: { old_password: string, password: string, confirm_pasword: string }
 */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapRequestHandler(changePasswordController)
)

export default usersRouter
