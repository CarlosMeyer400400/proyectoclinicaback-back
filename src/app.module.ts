import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { LoginModule } from './login/login.module';
import { RecuperarPassModule } from './recuperar-pass/recuperar-pass.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'roundhouse.proxy.rlwy.net',
    port: 33348,
    username: 'root',
    password: 'g2Eae1hhf2EFFc-eea2FGFc5ch4h1Deh',
    database: 'railway',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }), AuthModule, EmailModule, LoginModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 
 