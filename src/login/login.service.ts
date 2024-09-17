import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { ValidarLogin } from 'src/auth/dto/ValidLoginDto-auth';
import * as bcryptjs from 'bcryptjs';
import { AuthService } from 'src/auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { Logs } from 'src/auth/entities/logs.entity';

@Injectable()
export class LoginService {

  constructor(@InjectRepository(Auth) private authRepository: Repository<Auth>, private authService: AuthService,
    @InjectRepository(Logs) private logsRepository: Repository<Logs>) { }

  async validLogin(createLoginDto: ValidarLogin): Promise<boolean> {

    const data = await this.authService.getUser(createLoginDto.email)
    console.log(createLoginDto)
    if (await bcryptjs.compare(createLoginDto.contrasena, data.contrasena))
      return true;
    else
      return false;
  }

  asignarIntentos(id: number, intento: number) {
    this.authRepository.query(
      "UPDATE usuarios SET intentos = " + intento + " WHERE id_usuario = " + id + ""
    )
  }

  resetearIntentos(id: number) {
    console.log("conteo iniciado")
    setTimeout(() => {
      this.authRepository.query(
        "UPDATE usuarios SET intentos = 0 WHERE id_usuario = " + id + ""
      )
      console.log("Intentos reseteados")
    }, 300000)
  }

 async crearLogs(data:{accion:string,ip:string,url_solicitada:string,status:number,fecha:string},email:string){
    const userFound =  await this.authRepository.findOne({
      where: {
        email: email
      }
    })
    const newLog = this.logsRepository.create({
      usuario:userFound,
      ...data
    })
    this.logsRepository.save(newLog)
  }
}
