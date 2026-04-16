import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { UserDto, UserProfileDto } from '../http/user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ApiException } from '../../common/api-exception';

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

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async retrieveUserProfile(userId: string): Promise<UserProfileDto> {
    const foundUser = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!foundUser) {
      throw new ApiException(
        HttpStatus.UNAUTHORIZED,
        'UNAUTHORIZED',
        'Autenticação inválida ou ausente.',
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...user } = foundUser;
    return user;
  }
}
