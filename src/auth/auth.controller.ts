import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateCitasDto, CreateInformacionDto, CreatePreguntasDto, CreateServiciosDto, CreateContactoDto, CreateFeedbackDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Crear usuario
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // Agregar citas a un usuario específico
  @Post('citas/:id')
  addCitas(@Body() data: CreateCitasDto, @Param('id') id: string) {
    return this.authService.addCitas(data, parseInt(id));
  }


  // Obtener todos los usuarios
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  // Obtener un usuario específico por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  // Actualizar usuario por correo electrónico
  @Patch(':email')
  update(@Param('email') email: string, @Body() updateAuthDto: CreateAuthDto) {
    return this.authService.update(email, updateAuthDto);
  }

  // Actualizar contraseña de usuario por correo electrónico
  @Patch('password/:email')
  updatePassword(@Param('email') email: string, @Body() updateAuthDto: { contrasena: string; ip: string; fecha: string }) {
    return this.authService.updatePassword(email, updateAuthDto);
  }

  // Actualizar usuario por ID
  @Patch('perfil/:id')
  updateById(@Param('id') id: string, @Body() updateAuthDto: CreateAuthDto) {
    return this.authService.updateById(parseInt(id), updateAuthDto);
  }

  // Eliminar usuario por ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  // Obtener usuario específico por ID
  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  // Obtener todas las citas de un usuario específico por ID
  @Get('user/:id/citas')
  getAllCitasByUserId(@Param('id') id: string) {
    return this.authService.getAllCitasByUserId(id);
  }

  // Información
  // Obtener información específica por ID
  @Get('informacion/:id')
  getInformacionById(@Param('id') id: string) {
    return this.authService.getInformacionById(id);
  }

  // Actualizar información específica por ID
  @Patch('informacion/:id')
  updateInformacionById(@Param('id') id: string, @Body() updateInformacionDto: CreateInformacionDto) {
    return this.authService.updateInformacionById(id, updateInformacionDto);
  }

  // Preguntas
  // Obtener preguntas
  @Get('preguntas/:data')
  getPreguntas(@Param('data') data: string) {
    return this.authService.getPreguntas();
  }

  // Actualizar preguntas por ID
  @Patch('preguntas/:id')
  updatePreguntasById(@Param('id') id: string, @Body() updatePreguntasDto: CreatePreguntasDto) {
    return this.authService.updatePreguntasById(id, updatePreguntasDto);
  }

  // Crear nuevas preguntas
  @Post('preguntas')
  createPreguntas(@Body() createPreguntasDto: CreatePreguntasDto) {
    return this.authService.createPreguntas(createPreguntasDto);
  }

  // Eliminar preguntas por ID
  @Delete('preguntas/:id')
  deletePregunta(@Param('id') id: string) {
    return this.authService.deletePregunta(parseInt(id));
  }

  // Obtener autenticación
  @Get('auth')
  getAuth() {
    return this.authService.getAuth();
  }

  // Eliminar usuario por correo electrónico
  @Delete('user/:email')
  deleteUser(@Param('email') email: string) {
    return this.authService.deleteUser(email);
  }

  // Obtener cita específica
  @Get('cita/:data')
  getCita(@Param('data') data: string) {
    return this.authService.getCita().then(citas => citas.map(cita => ({
      ...cita,
      usuario: {
        id_usuario: cita.usuario.id_usuario,
        nombre: cita.usuario.nombre,
        apellidop: cita.usuario.apellidop,
        apellidom: cita.usuario.apellidom,
      }
    })));
  }



  // Servicios
  // Obtener servicios
  @Get('servicios/:data')
  getServicios(@Param('data') data: string) {
    return this.authService.getServicios();
  }

  // Crear un nuevo servicio
  @UseInterceptors(
    FileFieldsInterceptor([{name:'imagen'}])
  )
  @Post('servicios')
  createServicio(@Body() createServiciosDto: CreateServiciosDto, @UploadedFiles() file:{imagen?:Express.Multer.File[]}) {
    return this.authService.createServicio(createServiciosDto, file);
  }

  // Obtener todos los servicios
  @Get('servicios')
  findAllServicios() {
    return this.authService.findAllServicios();
  }

  // Obtener un servicio específico por ID
  @Get('servicios/:id')
  findOneServicio(@Param('id') id: string) {
    return this.authService.findOneServicio(+id);
  }

  // Actualizar servicio por ID
  @Patch('servicios/:id')
  updateServicio(@Param('id') id: string, @Body() updateServiciosDto: CreateServiciosDto) {
    return this.authService.updateServicio(+id, updateServiciosDto);
  }

  // Eliminar servicio por ID
  @Delete('servicios/:id')
  removeServicio(@Param('id') id: string) {
    return this.authService.removeServicio(+id);
  }

  // Obtener el número total de citas
  @Get('citas/count')
  async getTotalCitas(): Promise<number> {
    return this.authService.countCitas();
  }
  
  // Obtener cita por fecha
  @Get('citas/fecha/:fecha')
getCitasPorFecha(@Param('fecha') fecha: string) {
  const fechaBusqueda = new Date(fecha);
  return this.authService.getCitasPorFecha(fechaBusqueda);
}

//---------------------------------
// Preguntas
  // Obtener contacto
  @Get('contacto/:data')
  getContacto(@Param('data') data: string) {
    return this.authService.getContacto();
  }

  // Actualizar contacto por ID
  @Patch('contacto/:id')
  updateContactoById(@Param('id') id: string, @Body() updateContactoDto: CreateContactoDto) {
    return this.authService.updateContactoById(id, updateContactoDto);
  }

  // Crear nuevas contacto
  @Post('contacto')
  createContacto(@Body() createContactoDto: CreateContactoDto) {
    return this.authService.createContacto(createContactoDto);
  }

  // Eliminar contacto por ID
  @Delete('contacto/:id')
  deleteContacto(@Param('id') id: string) {
    return this.authService.deleteContacto(parseInt(id));
  }

//--------------




// Crear nueva Feedback para un usuario específico
@Post('feedback/:id')
createFeedback(@Body() createFeedbackDto: CreateFeedbackDto, @Param('id') id: string) {
  return this.authService.createFeedback(createFeedbackDto, parseInt(id));
}

// Obtener el total de feedbacks buenos, malos y regulares
@Get('feedback/stats')
async getFeedbackStats() {
  return this.authService.getFeedbackCount();
}

// Obtener el todo de feedbacks
@Get('feedback')
findAllFeedback() {
  return this.authService.findAllFeedback();
}

 // Obtener cita específica
 @Get('feedback/:data')
 getFeedback(@Param('data') data: string) {
   return this.authService.getFeedback().then(feedback => feedback.map(feedback => ({
     ...feedback,
     usuario: {
       id_usuario: feedback.usuario.id_usuario,
       nombre: feedback.usuario.nombre,
       apellidop: feedback.usuario.apellidop,
       apellidom: feedback.usuario.apellidom,
     }
   })));
 }


}
