import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, Cita, Informacion, Preguntas, Servicios, Contacto,Feedback } from './entities/auth.entity';
import { Logs } from './entities/logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auth,Cita,Informacion,Preguntas,Logs,Servicios, Contacto, Feedback])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
 