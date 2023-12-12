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
    return await this.client.user.create({
      data: { email, username, bio, password: await hashPassword(password) },
    });
  }

  async updateUser(
    id: string,
    updateBody: {
      email: string;
      username: string;
      bio: string;
    },
  ) {
    return await this.client.user.update({
      where: { id: id },
      data: updateBody,
    });
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
    return await this.client.user.findUnique({ where: { email: email } });
  }

  async findUserById(id: string) {
    return await this.client.user.findUnique({ where: { id: id } });
  }

  //OPT OPERATION
  async createNewOPT(userID: string) {
    return await this.client.otp.create({
      data: { code: this.genRandOtpCode(), userId: userID },
    });
  }

  async findLatestOpt(code: string) {
    return await this.client.otp.findFirst({
      where: { code: Number(code) },
      orderBy: { id: 'desc' },
    });
  }

  async findAndRemoveOtp(id: string) {
    return await this.client.otp.delete({ where: { id: id } });
  }
}
