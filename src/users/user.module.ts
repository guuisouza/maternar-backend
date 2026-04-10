import { Module } from '@nestjs/common';
import { UserController } from './http/user.controller';
import { UserService } from './application/user.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
