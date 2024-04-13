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
      apellidoP: userFound.apellidop,
      apellidoM: userFound.apellidom,
      fechaNacimiento:userFound.fecha,
      sexo: userFound.sexo,
      telefono: userFound.telefono,
      correo: userFound.email,
      usuario: userFound.nombreu
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
  
  async getAllPreguntas() {
    const preguntasFound = await this.preguntasRepository.find();
    return preguntasFound;
  }
  
  
  

}




