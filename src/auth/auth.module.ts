import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, Cita, Informacion, Preguntas } from './entities/auth.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth,Cita,Informacion,Preguntas])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
 