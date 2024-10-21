import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Logs } from 'src/auth/entities/logs.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Auth,Logs])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
