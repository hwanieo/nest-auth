import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  // 세션에 정보를 저장할 때 사용
  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, user.email);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, payload: any) => void,
  ) {
    const user = await this.userService.getUser(payload);

    if (!user) {
      done(new Error('No User'), null);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userInfo } = user;

    done(null, userInfo);
  }
}
