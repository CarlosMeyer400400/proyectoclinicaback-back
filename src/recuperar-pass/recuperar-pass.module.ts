import { Module } from '@nestjs/common';
import { RecuperarPassService } from './recuperar-pass.service';
import { RecuperarPassController } from './recuperar-pass.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Auth])],
  controllers: [RecuperarPassController],
  providers: [RecuperarPassService],
})
export class RecuperarPassModule {}
