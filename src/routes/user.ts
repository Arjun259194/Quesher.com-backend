import express from 'express';
import { userProfileController } from '../controllers/user';

const UserRouter = express.Router();

UserRouter.get('/profile', userProfileController);

export default UserRouter;
