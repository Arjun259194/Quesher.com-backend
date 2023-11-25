import Client from '../utils/database';
import MailService from '../utils/email';

export default abstract class Controller {
  protected db: Client;
  protected mail: MailService;

  constructor(db: Client, m: MailService) {
    this.db = db;
    this.mail = m;
  }
}
