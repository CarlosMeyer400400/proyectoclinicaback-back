import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateCitaDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, Cita, Informacion, Preguntas } from './entities/auth.entity';
import * as bcryptjs from 'bcryptjs';
import { ValidarLogin } from './dto/ValidLoginDto-auth';
import { CreateCitasDto } from './dto/create-cita.dto';
import { CreateInformacionDto } from './dto/create-informacion.dto';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Cita) 
    private citaRepository: Repository<Cita>,
    @InjectRepository(Informacion)
    private informacionRepository: Repository<Informacion>,
    @InjectRepository(Preguntas)
    private preguntasRepository: Repository<Preguntas>,

  ) {}

  create(createAuthDto: CreateAuthDto) {
    const {contrasena,...resultado}=createAuthDto
    const newuser = this.authRepository.create({
      contrasena: bcryptjs.hashSync(contrasena,10),
      ...resultado
    })
    return this.authRepository.save(newuser)
  }
  updateById(id:number,updateAuthDto: CreateAuthDto){
    this.authRepository.update(id,updateAuthDto)
      return {
        message: 'Usuario actualizado correctamente',
        status:HttpStatus.OK
      }
  }

  
  async update(email: string, updateAuthDto: CreateAuthDto) {
    const {contrasena,...data} = updateAuthDto;
    const foundUser = await this.authRepository.findOne({
      where:{
        email:email
      }
    })
    if(contrasena){
      const updateuser= this.authRepository.update(foundUser.id_usuario,{
        contrasena:bcryptjs.hashSync(contrasena,10),
        ...data
      })
      return updateuser
    }
    else{
      const updateuser= this.authRepository.update(foundUser.id_usuario,updateAuthDto)
      return updateuser
    }
    
  }

  async validLogin(createLoginDto: ValidarLogin):Promise<boolean> {

    const data = this.getUser(createLoginDto.email)

    if(await bcryptjs.compare(createLoginDto.contrasena, (await data).contrasena))
      return true;
    else
      return false; 
}

  findAll() {
    return this.authRepository.find();
  }

  findOne(id: string) {
    return this.authRepository.findOne({
      where: { email: id },
    });
  }
  remove(id: number) {
    return this.authRepository.delete({
      id_usuario: id
    })
  }
  getUser(email: string) {
    const user = this.authRepository.findOne({
      where: {
        email: email
      }
    });
    return user;
  }
  async addCitas(data:CreateCitaDto,id:number){
    const getUser = await this.authRepository.findOne({
      where:{
        id_usuario:id
      }
    });

    const newCita = this.citaRepository.create({
      usuario:getUser,
      ...data
    });
    this.citaRepository.save(newCita)
    return{
      message:"exito",
      status:HttpStatus.OK
    } ;
  }
  async getUserById(id:string){
    const userFound = await this.authRepository.findOne({
      where:{
        id_usuario:parseInt(id)
      }
    });
    return{
      nombre: userFound.nombre,
      apellidop: userFound.apellidop,
      apellidom: userFound.apellidom,
      fecha:userFound.fecha,
      sexo: userFound.sexo,
      telefono: userFound.telefono,
      email: userFound.email,
      nombreu: userFound.nombreu
    }
  }
  

 
  async getAllCitasByUserId(userId: string) {
    const citas = await this.citaRepository.find({
      where: {
        usuario: { id_usuario: parseInt(userId) } // Assuming 'usuario' is the relationship property in the Cita entity
      }
    });
    return citas;
  }

///informacion
  async getInformacionById(id:string){
    const informacionFound = await this.informacionRepository.findOne({
      where:{
        id_informacion:parseInt(id)
      }
    });
    return {
      mision: informacionFound.mision,
      vision: informacionFound.vision,
      quienessomos: informacionFound.quienessomos,
    };
  }
  ////

  async updateInformacionById(id: string, updateInformacionDto: CreateInformacionDto) {
    const informacionToUpdate = await this.informacionRepository.findOne({
      where: {
        id_informacion: parseInt(id)
      }
    });
  
    if (!informacionToUpdate) {
      // Manejar el caso en que no se encuentra la información con el ID proporcionado
      return {
        message: 'La información no fue encontrada',
        status: HttpStatus.NOT_FOUND
      };
    }
  
    const updatedInformacion = await this.informacionRepository.merge(informacionToUpdate, updateInformacionDto);
    await this.informacionRepository.save(updatedInformacion);
  
    return {
      message: 'Información actualizada correctamente',
      status: HttpStatus.OK
    };
  }

  
  ///preguntas
  async getPreguntas(){
    const preguntasFound = await this.preguntasRepository.find()
    return preguntasFound
  }
  ////
  async updatePreguntasById(id: string, updatePreguntasDto: CreatePreguntasDto) {
    const preguntasToUpdate = await this.preguntasRepository.findOne({
      where: {
        id_preguntas: parseInt(id)
      }
    });

    if (!preguntasToUpdate) {
      // Manejar el caso en que no se encuentra la pregunta con el ID proporcionado
      return {
        message: 'La pregunta no fue encontrada',
        status: HttpStatus.NOT_FOUND
      };
    }

    const updatedPreguntas = await this.preguntasRepository.merge(preguntasToUpdate, updatePreguntasDto);
    await this.preguntasRepository.save(updatedPreguntas);

    return {
      message: 'Pregunta actualizada correctamente',
      status: HttpStatus.OK
    };
  }
  /////
  async createPreguntas(createPreguntasDto: CreatePreguntasDto) {
    const nuevaPregunta = this.preguntasRepository.create(createPreguntasDto);
    await this.preguntasRepository.save(nuevaPregunta);
    return {
      message: 'Pregunta creada correctamente',
      status: HttpStatus.CREATED
    };
  }
/////
  async deletePregunta(id: number) {
    const preguntaExistente = await this.preguntasRepository.findOne({ where: { id_preguntas: id } });
    if (!preguntaExistente) {
      return {
        message: 'La pregunta no fue encontrada',
        status: HttpStatus.NOT_FOUND,
      };
    }
    await this.preguntasRepository.remove(preguntaExistente);
    return {
      message: 'Pregunta eliminada correctamente',
      status: HttpStatus.OK,
    };
  }
////////usuarios
  async getAuth(){
    const AuthFound = await this.authRepository.find()
    return AuthFound
  }

  async deleteUser(email: string) {
    const userToDelete = await this.authRepository.findOne({ where: { email } });
    if (!userToDelete) {
      throw new Error('Usuario no encontrado');
    }
    await this.authRepository.remove(userToDelete);
    return { message: 'Usuario eliminado correctamente' };
  }
  
 ///////////
 async getCita(){
  const citaFound = await this.citaRepository.find()
  return citaFound
}

}




