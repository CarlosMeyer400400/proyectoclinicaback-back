import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateCitaDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }
  @Post('citas/:id')
  addCitas(@Body() data: CreateCitaDto,@Param('id')id:string){
    console.log(id);
    return this.authService.addCitas(data,parseInt(id));
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
  @Patch('perfil/:id')
  updateById(@Param('id') id: string, @Body() updateAuthDto: CreateAuthDto) {
    return this.authService.updateById(parseInt(id), updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
  @Get('user/:id')
  getUserById(@Param('id') id:string){
    return this.authService.getUserById(id)
  }

  @Get('user/:id/citas')
  getAllCitasByUserId(@Param('id') id: string) {
    return this.authService.getAllCitasByUserId(id);
  }
  @Get('informacion/:id')
  getInformacionById(@Param('id') id:string){
    return this.authService.getInformacionById(id)
  }

  @Get('preguntas')
  async getAllPreguntas() {
    return this.authService.getAllPreguntas();
  }
  
 
}