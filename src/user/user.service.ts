import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, UpdateUserDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    return await this.userRepository.save(user);
  }

  async getUser(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }

  async updateUser(email: string, _user: UpdateUserDto) {
    const user = await this.getUser(email);

    user.username = _user.username;
    user.password = _user.password;

    return await this.userRepository.save(user);
  }

  async deleteUser(email: string) {
    await this.userRepository.delete({ email });
  }
}
