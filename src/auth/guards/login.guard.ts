import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (request.cookies['login']) {
      return true;
    }

    console.log(request.body);

    if (!request.body.email || !request.body.password) {
      return false;
    }

    const user = await this.authService.validateUser(
      request.body.email,
      request.body.password,
    );

    if (!user) {
      return false;
    }
    request.user = user;

    return true;
  }
}

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 부모 클래스(AuthGuard)의 canActivate 메서드를 호출하여 인증을 수행한다.
    const result = (await super.canActivate(context)) as boolean;

    // HTTP 요청 객체를 가져온다.
    const request = context.switchToHttp().getRequest();

    console.log(request.body);

    // Passport.js에서 제공하는 로그인 함수를 호출하여 사용자를 세션에 저장한다.
    await super.logIn(request);

    // 인증 결과를 반환한다.
    return result;
  }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // 세션에서 정보를 읽어서 인증 확인
    return request.isAuthenticated();
  }
}
