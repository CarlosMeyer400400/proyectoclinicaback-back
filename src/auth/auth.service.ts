import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto, CreateCitaDto} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, Cita, Informacion, Preguntas, Servicios } from './entities/auth.entity';
import * as bcryptjs from 'bcryptjs';
import { ValidarLogin } from './dto/ValidLoginDto-auth';
import { CreateCitasDto } from './dto/create-cita.dto';
import { CreateInformacionDto } from './dto/create-informacion.dto';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';
import { CreateServiciosDto } from './dto/create-servicios.dto';
import { Logs } from './entities/logs.entity';

import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';


import * as cloudinary from 'cloudinary';

cloudinary.v2.config({ 
  cloud_name: 'dtma1qalx', 
  api_key: '437213717654526', 
  api_secret: 'fCn9EbX6KWqI1WZZ_aTOWgv986g'
});

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
    @InjectRepository(Servicios)
    private serviciosRepository: Repository<Servicios>,
    @InjectRepository(Logs)
    private logsRepository: Repository<Logs>,
  ) {}

  create(createAuthDto: CreateAuthDto) {
    const { contrasena, ...resultado } = createAuthDto;
    const newuser = this.authRepository.create({
      contrasena: bcryptjs.hashSync(contrasena, 10),
      ...resultado
    });
    return this.authRepository.save(newuser);
  }

  async updateById(id: number, updateAuthDto: UpdateAuthDto) {
    const foundUser = await this.authRepository.findOne({ where: { id_usuario: id } });
    if (!foundUser) {
      return {
        message: 'Usuario no encontrado',
        status: HttpStatus.NOT_FOUND
      };
    }
    const { ip, fecha_log, ...data } = updateAuthDto;
    await this.authRepository.update(id, data);

    this.crearLogs({
      accion: 'Se actualizó la información del usuario',
      fecha: fecha_log,
      ip: ip,
      status: 200,
      url_solicitada: 'auth/perfil/:id',
    }, foundUser.email);

    return {
      message: 'Usuario actualizado correctamente',
      status: HttpStatus.OK
    };
  }

  async updatePassword(email: string, data: { contrasena: string, ip: string, fecha: string }) {
    const foundUser = await this.authRepository.findOne({ where: { email: email } });
    if (!foundUser) {
      return {
        message: 'Usuario no encontrado',
        status: HttpStatus.NOT_FOUND
      };
    }
    await this.authRepository.update(foundUser.id_usuario, {
      contrasena: bcryptjs.hashSync(data.contrasena, 10)
    });
    const newLog = this.logsRepository.create({
      accion: 'Cambio de contraseña',
      ip: data.ip,
      url_solicitada: 'auth/password/:email',
      status: 200,
      fecha: data.fecha,
      usuario: foundUser
    });
    await this.logsRepository.save(newLog);
    return {
      message: 'Contraseña actualizada correctamente',
      status: HttpStatus.OK
    };
  }

  async update(email: string, updateAuthDto: UpdateAuthDto) {
    const { contrasena, ...data } = updateAuthDto;
    const foundUser = await this.authRepository.findOne({ where: { email: email } });
    if (!foundUser) {
      return {
        message: 'Usuario no encontrado',
        status: HttpStatus.NOT_FOUND
      };
    }
    if (contrasena) {
      await this.authRepository.update(foundUser.id_usuario, {
        contrasena: bcryptjs.hashSync(contrasena, 10),
        ...data
      });
    } else {
      await this.authRepository.update(foundUser.id_usuario, data);
    }
    return {
      message: 'Usuario actualizado correctamente',
      status: HttpStatus.OK
    };
  }

  async validLogin(createLoginDto: ValidarLogin): Promise<boolean> {
    const data = await this.getUser(createLoginDto.email);
    if (!data) return false;
    return bcryptjs.compare(createLoginDto.contrasena, data.contrasena);
  }

  findAll() {
    return this.authRepository.find();
  }

  findOne(id: string) {
    return this.authRepository.findOne({ where: { email: id } });
  }

  remove(id: number) {
    return this.authRepository.delete({ id_usuario: id });
  }

  getUser(email: string) {
    return this.authRepository.findOne({ where: { email: email } });
  }

  async addCitas(data: CreateCitaDto, id: number) {
    const getUser = await this.authRepository.findOne({ where: { id_usuario: id } });
    if (!getUser) {
      return {
        message: 'Usuario no encontrado',
        status: HttpStatus.NOT_FOUND
      };
    }
    const newCita = this.citaRepository.create({ usuario: getUser, ...data });
    await this.citaRepository.save(newCita);
    return { message: "Cita creada con éxito", status: HttpStatus.OK };
  }

  async getUserById(id: string) {
    const userFound = await this.authRepository.findOne({ where: { id_usuario: parseInt(id) } });
    if (!userFound) {
      return {
        message: 'Usuario no encontrado',
        status: HttpStatus.NOT_FOUND
      };
    }
    return {
      nombre: userFound.nombre,
      apellidop: userFound.apellidop,
      apellidom: userFound.apellidom,
      fecha: userFound.fecha,
      sexo: userFound.sexo,
      telefono: userFound.telefono,
      email: userFound.email,
      nombreu: userFound.nombreu
    };
  }

  async getAllCitasByUserId(userId: string) {
    const citas = await this.citaRepository.find({ where: { usuario: { id_usuario: parseInt(userId) } } });
    return citas;
  }

  async getInformacionById(id: string) {
    const informacionFound = await this.informacionRepository.findOne({ where: { id_informacion: parseInt(id) } });
    if (!informacionFound) {
      return {
        message: 'Información no encontrada',
        status: HttpStatus.NOT_FOUND
      };
    }
    return {
      mision: informacionFound.mision,
      vision: informacionFound.vision,
      quienessomos: informacionFound.quienessomos,
    };
  }

  async updateInformacionById(id: string, updateInformacionDto: CreateInformacionDto) {
    const informacionToUpdate = await this.informacionRepository.findOne({ where: { id_informacion: parseInt(id) } });
    if (!informacionToUpdate) {
      return {
        message: 'La información no fue encontrada',
        status: HttpStatus.NOT_FOUND
      };
    }
    const updatedInformacion = this.informacionRepository.merge(informacionToUpdate, updateInformacionDto);
    await this.informacionRepository.save(updatedInformacion);
    return {
      message: 'Información actualizada correctamente',
      status: HttpStatus.OK
    };
  }

  async getPreguntas() {
    const preguntasFound = await this.preguntasRepository.find();
    return preguntasFound;
  }

  async updatePreguntasById(id: string, updatePreguntasDto: CreatePreguntasDto) {
    const preguntasToUpdate = await this.preguntasRepository.findOne({ where: { id_preguntas: parseInt(id) } });
    if (!preguntasToUpdate) {
      return {
        message: 'La pregunta no fue encontrada',
        status: HttpStatus.NOT_FOUND
      };
    }
    const updatedPreguntas = this.preguntasRepository.merge(preguntasToUpdate, updatePreguntasDto);
    await this.preguntasRepository.save(updatedPreguntas);
    return {
      message: 'Pregunta actualizada correctamente',
      status: HttpStatus.OK
    };
  }

  async createPreguntas(createPreguntasDto: CreatePreguntasDto) {
    const nuevaPregunta = this.preguntasRepository.create(createPreguntasDto);
    await this.preguntasRepository.save(nuevaPregunta);
    return {
      message: 'Pregunta creada correctamente',
      status: HttpStatus.CREATED
    };
  }

  async deletePregunta(id: number) {
    const preguntaExistente = await this.preguntasRepository.findOne({ where: { id_preguntas: id } });
    if (!preguntaExistente) {
      return {
        message: 'La pregunta no fue encontrada',
        status: HttpStatus.NOT_FOUND
      };
    }
    await this.preguntasRepository.remove(preguntaExistente);
    return {
      message: 'Pregunta eliminada correctamente',
      status: HttpStatus.OK
    };
  }

  async getAuth() {
    const AuthFound = await this.authRepository.find();
    return AuthFound;
  }

  async deleteUser(email: string) {
    const userToDelete = await this.authRepository.findOne({ where: { email } });
    if (!userToDelete) {
      throw new Error('Usuario no encontrado');
    }
    await this.authRepository.remove(userToDelete);
    return { message: 'Usuario eliminado correctamente' };
  }

  async getCita() {
    const citaFound = await this.citaRepository.find();
    return citaFound;
  }

  async crearLogs(data: { accion: string, ip: string, url_solicitada: string, status: number, fecha: string }, email: string) {
    const userFound = await this.authRepository.findOne({ where: { email: email } });
    if (!userFound) {
      return {
        message: 'Usuario no encontrado',
        status: HttpStatus.NOT_FOUND
      };
    }
    const newLog = this.logsRepository.create({
      usuario: userFound,
      ...data
    });
    await this.logsRepository.save(newLog);
  }

  async createServicio(createServiciosDto: CreateServiciosDto,file:{imagen?:Express.Multer.File[]}) {

    const filePath = path.join(os.tmpdir(), file.imagen[0].originalname);
    fs.writeFileSync(filePath,file.imagen[0].buffer);
    const result = cloudinary.v2.uploader.upload(filePath,{
      folder:'imagenes-servicios',
      resource_type:'image'
    });
    const newServicio = this.serviciosRepository.create({
      imagen: (await result).secure_url,
      ...createServiciosDto
    });
    await this.serviciosRepository.save(newServicio);
    return {
      message: 'Servicio creado correctamente',
      status: HttpStatus.CREATED,
    };
  }
//SERVICIOS

async getServicios() {
  const ServiciosFound = await this.serviciosRepository.find();
  return ServiciosFound;
}


async findAllServicios() {
  return this.serviciosRepository.find();
}

async findOneServicio(id: number) {
  const servicio = await this.serviciosRepository.findOne({ where: { id_servicio: id } });
  if (!servicio) {
    return {
      message: 'Servicio no encontrado',
      status: HttpStatus.NOT_FOUND,
    };
  }
  return servicio; 
}

async updateServicio(id: number, updateServiciosDto: CreateServiciosDto) {
  const servicioToUpdate = await this.serviciosRepository.findOne({ where: { id_servicio: id } });
  if (!servicioToUpdate) {
    return {
      message: 'Servicio no encontrado',
      status: HttpStatus.NOT_FOUND,
    };
  }
  const updatedServicio = this.serviciosRepository.merge(servicioToUpdate, updateServiciosDto);
  await this.serviciosRepository.save(updatedServicio);
  return {
    message: 'Servicio actualizado correctamente',
    status: HttpStatus.OK,
  };
}

async removeServicio(id: number) {
  const servicioToDelete = await this.serviciosRepository.findOne({ where: { id_servicio: id } });
  if (!servicioToDelete) {
    return {
      message: 'Servicio no encontrado',
      status: HttpStatus.NOT_FOUND,
    };
  }
  await this.serviciosRepository.remove(servicioToDelete);
  return {
    message: 'Servicio eliminado correctamente',
    status: HttpStatus.OK,
  };
}

//numero de citas
async countCitas(): Promise<number> {
  const count = await this.citaRepository.count();
  return count;
}
}