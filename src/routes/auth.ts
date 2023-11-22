import express from 'express';
import {
  OTPController,
  loginController,
  registerController,
} from '../controllers/auth';

const AuthRouter = express.Router();

AuthRouter.post('/register', registerController);
AuthRouter.post('/login', loginController);
AuthRouter.get('/login/verify/otp', OTPController);
AuthRouter.post('/logout');

export default AuthRouter;
