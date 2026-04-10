import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UserDto } from '../http/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DatabaseService) {}

  async create(newUser: UserDto) {
    const userEmailAlreadyExists = await this.prisma.user.findFirst({
      where: {
        email: newUser.email,
      },
    });

    if (userEmailAlreadyExists) {
      throw new ConflictException('Email already registered');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    await this.prisma.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword,
        birthDate: new Date(newUser.birthDate),
      },
    });

    return { message: 'User created successfully' };
  }
}
