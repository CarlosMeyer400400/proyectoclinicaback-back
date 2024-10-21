import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly userService: AuthService
  ) {}

  intento: number = 0;

  @Post()
  async validLogin(@Body() createLoginDto: CreateLoginDto) {
    try {
      const datos = await this.userService.getUser(createLoginDto.email);

      if (!datos) {
        throw new HttpException("El correo no existe", HttpStatus.NOT_FOUND);
      }

      this.intento = datos.intentos;

      if (this.intento >= 50) {
        return {
          message: 'Número máximo de intentos alcanzado',
          status: HttpStatus.CONFLICT,
          nIntentos: this.intento,
        };
      }

      this.intento++;
      await this.loginService.asignarIntentos(datos.id_usuario, this.intento);

      const isLoginValid = await this.loginService.validLogin(createLoginDto);
      
      if (isLoginValid) {
        await this.loginService.resetearIntentos(datos.id_usuario);
        this.loginService.crearLogs({
          accion: 'Inicio de sesión',
          fecha: createLoginDto.fecha,
          ip: createLoginDto.ip,
          status: 200,
          url_solicitada: '/login',
        }, datos.email);
        
        return {
          message: 'Login correcto',
          status: 200,
          token: datos.id_usuario,
        };
      } else {
        return {
          message: 'Login incorrecto',
          status: 400,
        };
      }
    } catch (error) {
      console.error(error); // Para depuración
      throw new HttpException("Error al procesar la solicitud", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
