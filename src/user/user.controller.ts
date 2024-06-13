import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Body() user: User) {
    await this.userService.createUser(user);
    return 'User created success';
  }

  @Get('/getUser/:email')
  async getUser(@Param('email') email: string) {
    return await this.userService.getUser(email);
  }

  @Put('/update/:email')
  async updateUser(@Param('email') email: string, @Body() _user: User) {
    return await this.userService.updateUser(email, _user);
  }

  @Delete('/delete/:email')
  async deleteUser(@Param('email') email: string) {
    await this.userService.deleteUser(email);
    return `User ${email} delete success`;
  }
}
