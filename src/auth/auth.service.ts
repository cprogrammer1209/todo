import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(mobile: string): Promise<{ access_token: string }> {
    let user :any= await this.usersService.findByMobile(mobile);
    if (!user) {
      user = await this.usersService.createUser(mobile);
    }
    const payload = { sub: user._id, mobile: user.mobile };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}