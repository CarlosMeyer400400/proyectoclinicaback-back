import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';
import { ValidarLogin } from 'src/auth/dto/ValidLoginDto-auth';
import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {

  constructor(private readonly loginService: LoginService, private userService:AuthService) {}

  intento:number = 0;

  @Post()
  async validLogin(@Body() createLoginDto: CreateLoginDto) {
    console.log(createLoginDto.contrasena)
    try 
    {
      console.log("entra")
      const datos = await this.userService.getUser(createLoginDto.email)
      if(datos === null) throw new Error("error")

      this.intento = datos.intentos;
      if(this.intento === 5){  
        return {
        message: 'Numero de maxinmo de intentos alcanzado',
        status: HttpStatus.CONFLICT,
        nIntentos: this.intento
      }}
      else
      {
        this.intento++;
        this.loginService.asignarIntentos(datos.id_usuario,this.intento)
          if(this.intento >= 5)
          {
            console.log("la de abajo")
            this.loginService.resetearIntentos(datos.id_usuario)
            this.loginService.crearLogs({accion:'Sesion bloqueada',fecha:createLoginDto.fecha,ip:createLoginDto.ip,status:409,url_solicitada:'/login'},datos.email)
            return {
                  message: 'Numero de maxinmo de intentos alcanzado',
                  status: HttpStatus.CONFLICT,
                  nIntentos: this.intento
                }
          }
          else
          {
            const data = this.loginService.validLogin(createLoginDto);
            if((await data) === true)
            {
              this.loginService.resetearIntentos(datos.id_usuario)
              this.loginService.crearLogs({accion:'Inicio de sesion',fecha:createLoginDto.fecha,ip:createLoginDto.ip,status:200,url_solicitada:'/login'},datos.email)
              return {
                    message: 'Login correcto',
                    status: 200,
                    token: datos.id_usuario
                  } 
            }
            else
            return {
                  message: 'Login incorrecto',
                  status: 400
                }
          }
      }
    } catch (error) {
      throw new HttpException("El correo no existe", HttpStatus.FOUND);
    }
  }

}
