import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {}

  async findByMobile(mobile: string) {
    return this.db.collection('users').findOne({ mobile });
  }

  async createUser(mobile: string) {
    const user = {
      mobile,
      createdAt: new Date(),
    };
    await this.db.collection('users').insertOne(user);
    return user;
  }
}