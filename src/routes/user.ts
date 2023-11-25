import express, { Router, type Express } from 'express';
import UserController from '../controllers/user';
import authCheck from '../middleware/auth';
import Client from '../utils/database';
import MailService from '../utils/email';

export default class UserRouter {
  private router: Router;
  private controller: UserController;
  constructor(client: Client, mail: MailService) {
    this.router = express.Router();
    this.controller = new UserController(client, mail);
  }

  SetRouter(server: Express) {
    server.use('/user', authCheck, this.router);
    this.router.get('/profile', this.controller.PROFILE);
    this.router.get('/:id', this.controller.GET);
    this.router.put('/profile/update', this.controller.UPDATE);
    this.router.delete('/profile', this.controller.DELETE);
  }
}
