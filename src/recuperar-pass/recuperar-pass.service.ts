import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateRecuperarPassDto } from './dto/create-recuperar-pass.dto';
import { UpdateRecuperarPassDto } from './dto/update-recuperar-pass.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

interface DataUser{
  email:string;
}
interface DataRespuesta{
  email:string;
  respuesta:string;
}
@Injectable()
export class RecuperarPassService {

  constructor(@InjectRepository(Auth) private userRepository:Repository<Auth>){}
  async checkEmail(datauser: DataUser) {
  const foundUser = await this.userRepository.findOne({
      where: {
        email: datauser.email
      }
    });
    if(!foundUser) return {
      status:HttpStatus.NOT_FOUND,
      message:"El correo no existe"
    }
    else
      return {
        status:HttpStatus.OK,
        message:"El correo existe"
      }  
  }

  async returnQuestion(dataUser:DataUser){
    const foundUser = await this.userRepository.findOne({
      where: {
        email: dataUser.email
      }
    });
    console.log("ola",foundUser)
    if(!foundUser) return {
      status:HttpStatus.NOT_FOUND,
      message:"El correo no existe"
    }
    else
      return {
        status:HttpStatus.OK,
        question:foundUser.pregunta
      }  
  }
  async checkRespuesta(dataRespuesta:DataRespuesta){
    const foundUser = await this.userRepository.findOne({
      where: {
        email: dataRespuesta.email
      }
    });
    if(!foundUser) return {
      status:HttpStatus.NOT_FOUND,
      message:"El correo no existe"
    }
    else{
      if(foundUser.respuesta === dataRespuesta.respuesta){
        return {
          status:HttpStatus.OK,
          message:"La respuesta es correcta"
        }
      }
      else{
        return {
          status:HttpStatus.CONFLICT,
          message:"La respuesta es incorrecta"
        }
      }
    }
  }
}
