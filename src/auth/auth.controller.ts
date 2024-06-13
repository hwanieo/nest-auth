import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  AuthenticatedGuard,
  LocalAuthGuard,
  LoginGuard,
} from 'src/auth/guards/login.guard';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }

  @Post('login')
  async login(@Request() req, @Response() res) {
    const userInfo = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    if (userInfo) {
      res.cookie('login', JSON.stringify(userInfo), {
        httpOnly: true,
        maxAge: 1000 * 10,
      });
      return res.status(200).send({ message: 'login success' });
    } else {
      return res.status(401).send({ message: 'Unauthorized' });
    }
  }

  @UseGuards(LoginGuard)
  @Post('login2')
  async login2(@Request() req, @Response() res) {
    if (!req.cookies['login'] && req.user) {
      res.cookie('login', JSON.stringify(req.user.email), {
        httpOnly: true,
        maxAge: 1000 * 10,
      });
      return res.status(200).send({ message: 'login2 success' });
    }
    return res.status(401).send({ message: 'Unauthorized' });
  }

  @UseGuards(LoginGuard)
  @Get('guard-test')
  guardTest() {
    return '로그인된 때만 이 글이 보입니다.';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login3')
  login3(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('guard-test2')
  testGuardWithSession(@Request() req) {
    return req.user;
  }

  @UseGuards(LoginGuard, LocalAuthGuard)
  @Post('login4')
  login4(@Request() req, @Response() res) {
    if (!req.cookies['login'] && req.user) {
      res.cookie('login', JSON.stringify(req.user.email), {
        httpOnly: true,
        maxAge: 1000 * 10,
      });
      return res.status(200).send({ message: 'login2 success' });
    }
    return res.status(401).send({ message: 'Unauthorized' });
  }
}
