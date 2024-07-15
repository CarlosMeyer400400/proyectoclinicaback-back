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
        //TypeOrmModule.forRoot({
        //type: 'mysql',
        //host: 'localhost',//roundhouse.proxy.rlwy.net
        //port: 3306,
        //username: 'root',
        //password: '',
        //database: 'db_clinica_avance',
        //entities: [__dirname + '/**/*.entity{.ts,.js}'],
        //synchronize: true,
        TypeOrmModule.forRoot({
        type: 'mysql',
        host: 'monorail.proxy.rlwy.net',
        port: 47472,
        username: 'root',
        password: 'BPBNxaDywBgswMlhaYvmslWMaCINeibD',
        database: 'railway',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
  }),
  AuthModule, EmailModule, LoginModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
 