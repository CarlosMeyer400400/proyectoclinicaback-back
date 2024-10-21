import { HttpStatus, Injectable, HttpException } from '@nestjs/common';
import { CreateAuthDto, CreateCitasDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth, Cita, Informacion, Preguntas, Servicios, Contacto,Feedback } from './entities/auth.entity';
import * as bcryptjs from 'bcryptjs';
import { ValidarLogin } from './dto/ValidLoginDto-auth';
import { CreateInformacionDto } from './dto/create-informacion.dto';
import { CreatePreguntasDto } from './dto/create-preguntas.dto';
import { CreateServiciosDto } from './dto/create-servicios.dto';
import { CreateContactoDto } from './dto/create-auth.dto';
import { CreateFeedbackDto } from './dto/create-auth.dto';

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
    @InjectRepository(Contacto)
    private contactoRepository: Repository<Contacto>,
    @InjectRepository(Logs)
    private logsRepository: Repository<Logs>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  // Crear un nuevo usuario
  create(createAuthDto: CreateAuthDto) {
    const { contrasena, ...resultado } = createAuthDto;
    const newuser = this.authRepository.create({
      contrasena: bcryptjs.hashSync(contrasena, 10),
      ...resultado
    });
    return this.authRepository.save(newuser);
  }

  // Actualizar usuario por ID
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

  // Actualizar contraseña de usuario
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

  // Actualizar usuario por correo electrónico
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

  // Validar login del usuario
  async validLogin(createLoginDto: ValidarLogin): Promise<boolean> {
    const data = await this.getUser(createLoginDto.email);
    if (!data) return false;
    return bcryptjs.compare(createLoginDto.contrasena, data.contrasena);
  }

  // Obtener todos los usuarios
  findAll() {
    return this.authRepository.find();
  }

  // Obtener un usuario por ID
  findOne(id: string) {
    return this.authRepository.findOne({ where: { email: id } });
  }

  // Eliminar un usuario por ID
  remove(id: number) {
    return this.authRepository.delete({ id_usuario: id });
  }

  // Obtener un usuario por correo electrónico
  getUser(email: string) {
    return this.authRepository.findOne({ where: { email: email } });
  }

  // Agregar cita a un usuario
  async addCitas(data: CreateCitasDto, id: number) {
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

  // Obtener el número total de citas
  async countCitas(): Promise<number> {
    const count = await this.citaRepository.count();
    return count;
  }


  // Obtener usuario por ID
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

  // Obtener todas las citas de un usuario por ID de usuario
  async getAllCitasByUserId(userId: string) {
    const citas = await this.citaRepository.find({ where: { usuario: { id_usuario: parseInt(userId) } } });
    return citas;
  }

  // Obtener información por ID
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

  // Actualizar información por ID
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

  // Obtener todas las preguntas
  async getPreguntas() {
    const preguntasFound = await this.preguntasRepository.find();
    return preguntasFound;
  }

  // Actualizar pregunta por ID
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

  // Crear nueva pregunta
  async createPreguntas(createPreguntasDto: CreatePreguntasDto) {
    const nuevaPregunta = this.preguntasRepository.create(createPreguntasDto);
    await this.preguntasRepository.save(nuevaPregunta);
    return {
      message: 'Pregunta creada correctamente',
      status: HttpStatus.CREATED
    };
  }

  // Eliminar pregunta por ID
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

  // Obtener todos los usuarios
  async getAuth() {
    const AuthFound = await this.authRepository.find();
    return AuthFound;
  }

  // Eliminar usuario por correo electrónico
  async deleteUser(email: string) {
    const userToDelete = await this.authRepository.findOne({ where: { email } });
    if (!userToDelete) {
      throw new Error('Usuario no encontrado');
    }
    await this.authRepository.remove(userToDelete);
    return { message: 'Usuario eliminado correctamente' };
  }

  // Obtener todas las citas
async getCita() {
  const citaFound = await this.citaRepository.find({ relations: ['usuario'] });
  return citaFound;
}


  // Crear logs de acciones del usuario
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

  // Crear un nuevo servicio con imagen
  async createServicio(createServiciosDto: CreateServiciosDto, file: { imagen?: Express.Multer.File[] }) {
    const filePath = path.join(os.tmpdir(), file.imagen[0].originalname);
    fs.writeFileSync(filePath, file.imagen[0].buffer);
    const result = cloudinary.v2.uploader.upload(filePath, {
      folder: 'imagenes-servicios',
      resource_type: 'image'
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

  // Obtener todos los servicios
  async getServicios() {
    const ServiciosFound = await this.serviciosRepository.find();
    return ServiciosFound;
  }

  // Obtener todos los servicios
  async findAllServicios() {
    return this.serviciosRepository.find();
  }

  // Obtener un servicio por ID
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

  // Actualizar un servicio por ID
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

  // Eliminar un servicio por ID
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
  // Obtener citas por fecha específica
async getCitasPorFecha(fecha: Date) {
  const citas = await this.citaRepository.find({ where: { fecha: fecha }, relations: ['usuario'] });
  return citas;
}

// Obtener citas por fecha y hora específica
async getCitasPorFechaYHora(fecha: Date, hora: string) {
  const citas = await this.citaRepository.find({
    where: {
      fecha: fecha,
      hora: hora,
    },
    relations: ['usuario'],
  });
  return citas;
}


// Obtener todos los contactos
async getContacto() {
  const contactoFound = await this.contactoRepository.find();
  return contactoFound;
}

// Actualizar contacto por ID
async updateContactoById(id: string, updateContactoDto: CreateContactoDto) {
  const contactoToUpdate = await this.contactoRepository.findOne({ where: { id_contacto: parseInt(id) } });
  if (!contactoToUpdate) {
    return {
      message: 'El contacto no fue encontrado',
      status: HttpStatus.NOT_FOUND
    };
  }
  const updatedContacto = this.contactoRepository.merge(contactoToUpdate, updateContactoDto);
  await this.contactoRepository.save(updatedContacto);
  return {
    message: 'Contacto actualizado correctamente',
    status: HttpStatus.OK
  };
}

// Crear nuevo contacto
async createContacto(createContactoDto: CreateContactoDto) {
  const nuevoContacto = this.contactoRepository.create(createContactoDto);
  await this.contactoRepository.save(nuevoContacto);
  return {
    message: 'Contacto creado correctamente',
    status: HttpStatus.CREATED
  };
}

// Eliminar contacto por ID
async deleteContacto(id: number) {
  const contactoExistente = await this.contactoRepository.findOne({ where: { id_contacto: id } });
  if (!contactoExistente) {
    return {
      message: 'El contacto no fue encontrado',
      status: HttpStatus.NOT_FOUND
    };
  }
  await this.contactoRepository.remove(contactoExistente);
  return {
    message: 'Contacto eliminado correctamente',
    status: HttpStatus.OK
  };
}

//--------------



//CREAR EL FEEDBACK


async createFeedback(createFeedbackDto: CreateFeedbackDto, userId: number) {
  const getUser = await this.authRepository.findOne({ where: { id_usuario: userId } });
  
  if (!getUser) {
    return {
      message: 'Usuario no encontrado',
      status: HttpStatus.NOT_FOUND
    };
  }

  const nuevaFeedback = this.feedbackRepository.create({ usuario: getUser, ...createFeedbackDto });
  await this.feedbackRepository.save(nuevaFeedback);
  
  return {
    message: 'Feedback creada correctamente',
    status: HttpStatus.CREATED
  };
}







// Obtener todas las respuestas
async getFeedbackCount() {
  try {
    const feedbacks = await this.feedbackRepository.find();  // Obtener todas las respuestas
    let buenas = 0;
    let malas = 0;
    let regulares = 0;

    feedbacks.forEach(feedback => {
      const respuesta = feedback.respuesta.toLowerCase();

      if (respuesta.includes('bueno') || respuesta.includes('excelente')) {
        buenas++;
      } else if (respuesta.includes('malo') || respuesta.includes('pobre')) {
        malas++;
      } else if (respuesta.includes('regular') || respuesta.includes('medio')) {
        regulares++;
      }
    });

    return {
      buenas,
      malas,
      regulares,
      total: buenas + malas + regulares,
    };
  } catch (error) {
    throw new HttpException('Error al obtener las estadísticas de feedback', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

// Obtener el todo de feedbacks
async findAllFeedback() {
  return this.feedbackRepository.find();
}

  // Obtener todas las feedbackkkk
  async getFeedback() {
    const feedbackFound = await this.feedbackRepository.find({ relations: ['usuario'] });
    return feedbackFound;
  }


}
