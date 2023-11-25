import { PrismaClient } from '@prisma/client';
import { hashPassword } from './hash';

export default class Client {
  private client: PrismaClient;

  constructor(c: PrismaClient) {
    this.client = c;
  }

  private genRandOtpCode() {
    const CODE_LEN = 6;
    const code = Math.floor(100000 + Math.random() * 900000);
    return Number(code.toString().substring(0, CODE_LEN));
  }

  // TODO: method yet to be implemented
  public async isValidID(id: string) {
    throw new Error('Method not implemented');
  }

  //USER Operations
  async createNewUser(
    email: string,
    username: string,
    password: string,
    bio: string,
  ) {
    const QUERY = {
      data: { email, username, bio, password: await hashPassword(password) },
    } as const;

    return await this.client.user.create(QUERY);
  }

  async updateUser(
    id: string,
    updateBody: {
      email: string;
      username: string;
      bio: string;
    },
  ) {
    const QUERY = { where: { id: id }, data: updateBody } as const;

    return await this.client.user.update(QUERY);
  }

  async deleteUser(id: string) {
    const transaction = await this.client.$transaction([
      this.client.questionLike.deleteMany({ where: { userId: id } }),
      this.client.answer.deleteMany({ where: { userId: id } }),
      this.client.question.deleteMany({ where: { userId: id } }),
      this.client.otp.deleteMany({ where: { userId: id } }),
      this.client.user.delete({ where: { id: id } }),
    ]);

    return transaction;
  }

  async findUserByEmail(email: string) {
    const QUERY = { where: { email: email } } as const;
    return await this.client.user.findUnique(QUERY);
  }

  async findUserById(id: string) {
    const QUERY = { where: { id: id } } as const;
    return await this.client.user.findUnique(QUERY);
  }

  //OPT OPERATION
  async createNewOPT(userID: string) {
    const QUERY = {
      data: { code: this.genRandOtpCode(), userId: userID },
    } as const;
    return await this.client.otp.create(QUERY);
  }

  async findLatestOptByEmail(email: string) {
    const QUERY = {
      where: { User: { email: email } },
      include: { User: true },
      orderBy: { id: 'desc' },
    } as const;

    return await this.client.otp.findFirst(QUERY);
  }
}
