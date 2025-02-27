import { createBrowserRouter } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import VerifyEmail from './VerifyEmail'
import ResetPassword from './ResetPassword'
import VerifyForgotPasswordToken from './VerifyForgotPasswordToken'
import Chat from './Chat'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login/oauth',
    element: <Login />
  },
  {
    path: '/email-verifications',
    element: <VerifyEmail />
  },
  {
    path: '/forgot-password',
    element: <VerifyForgotPasswordToken />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/chat',
    element: <Chat />
  }
])

export default router
