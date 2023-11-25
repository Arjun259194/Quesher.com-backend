import express, { Router, type Express } from 'express';
import AuthController from '../controllers/auth';
import Client from '../utils/database';
import MailService from '../utils/email';

export default class AuthRouter {
  private router: Router;
  private controller: AuthController;
  constructor(client: Client, mail: MailService) {
    this.router = express.Router();
    this.controller = new AuthController(client, mail);
  }

  SetRouter(server: Express) {
    server.use('/auth', this.router);
    this.router.post('/register', this.controller.REGISTER);
    this.router.post('/login', this.controller.LOGIN);
    this.router.get('/login/verify/otp', this.controller.OPT);
    this.router.post('/logout');
  }
}
