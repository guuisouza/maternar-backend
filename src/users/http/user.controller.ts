import { Body, Controller, Post } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from '../application/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: UserDto) {
    return await this.userService.create(body);
  }
}
