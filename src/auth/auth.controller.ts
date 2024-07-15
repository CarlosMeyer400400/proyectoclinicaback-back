import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateCitaDto, CreateInformacionDto, CreatePreguntasDto, CreateServiciosDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Usuarios
  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('citas/:id')
  addCitas(@Body() data: CreateCitaDto, @Param('id') id: string) {
    return this.authService.addCitas(data, parseInt(id));
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateAuthDto: CreateAuthDto) {
    return this.authService.update(email, updateAuthDto);
  }

  @Patch('password/:email')
  updatePassword(@Param('email') email: string, @Body() updateAuthDto: { contrasena: string; ip: string; fecha: string }) {
    return this.authService.updatePassword(email, updateAuthDto);
  }

  @Patch('perfil/:id')
  updateById(@Param('id') id: string, @Body() updateAuthDto: CreateAuthDto) {
    return this.authService.updateById(parseInt(id), updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }

  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @Get('user/:id/citas')
  getAllCitasByUserId(@Param('id') id: string) {
    return this.authService.getAllCitasByUserId(id);
  }

  // Información
  @Get('informacion/:id')
  getInformacionById(@Param('id') id: string) {
    return this.authService.getInformacionById(id);
  }

  @Patch('informacion/:id')
  updateInformacionById(@Param('id') id: string, @Body() updateInformacionDto: CreateInformacionDto) {
    return this.authService.updateInformacionById(id, updateInformacionDto);
  }

  // Preguntas
  @Get('preguntas/:data')
  getPreguntas(@Param('data') data: string) {
    return this.authService.getPreguntas();
  }

  @Patch('preguntas/:id')
  updatePreguntasById(@Param('id') id: string, @Body() updatePreguntasDto: CreatePreguntasDto) {
    return this.authService.updatePreguntasById(id, updatePreguntasDto);
  }

  @Post('preguntas')
  createPreguntas(@Body() createPreguntasDto: CreatePreguntasDto) {
    return this.authService.createPreguntas(createPreguntasDto);
  }

  @Delete('preguntas/:id')
  deletePregunta(@Param('id') id: string) {
    return this.authService.deletePregunta(parseInt(id));
  }

  @Get('auth')
  getAuth() {
    return this.authService.getAuth();
  }

  @Delete('user/:email')
  deleteUser(@Param('email') email: string) {
    return this.authService.deleteUser(email);
  }

  @Get('cita/:data')
  getCita(@Param('data') data: string) {
    return this.authService.getCita();
  }

  // Servicios
  @Get('servicios/:data')
  getServicios(@Param('data') data: string) {
    return this.authService.getServicios();
  }


  @UseInterceptors(
    FileFieldsInterceptor([{name:'imagen'}])
  )
  @Post('servicios')
  createServicio(@Body() createServiciosDto: CreateServiciosDto,@UploadedFiles() file:{imagen?:Express.Multer.File[]}) {
    return this.authService.createServicio(createServiciosDto,file);
  }

  @Get('servicios')
  findAllServicios() {
    return this.authService.findAllServicios();
  }

  @Get('servicios/:id')
  findOneServicio(@Param('id') id: string) {
    return this.authService.findOneServicio(+id);
  }

  @Patch('servicios/:id')
  updateServicio(@Param('id') id: string, @Body() updateServiciosDto: CreateServiciosDto) {
    return this.authService.updateServicio(+id, updateServiciosDto);
  }

  @Delete('servicios/:id')
  removeServicio(@Param('id') id: string) {
    return this.authService.removeServicio(+id);
  }

  //numero de citas 
  @Get('citas/count')
  async getTotalCitas(): Promise<number> {
    return this.authService.countCitas();
  }
}
