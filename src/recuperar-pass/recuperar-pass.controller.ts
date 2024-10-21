import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RecuperarPassService } from './recuperar-pass.service';
import { CreateRecuperarPassDto } from './dto/create-recuperar-pass.dto';
import { UpdateRecuperarPassDto } from './dto/update-recuperar-pass.dto';

@Controller('recuperar-pass')
export class RecuperarPassController {
  constructor(private readonly recuperarPassService: RecuperarPassService) {}

  @Post()
  checkEmailByUser(@Body() data: {email:""}) {
    return this.recuperarPassService.checkEmail(data);
  }
  @Post('/check-question')
  getQuestionByUser(@Body() data: {email:""}) {
    return this.recuperarPassService.returnQuestion(data);
  }
  @Post('/check-respuesta')
  checkRespuestaByUser(@Body() data: {email:"",respuesta:""}) {
    return this.recuperarPassService.checkRespuesta(data);
  }
}
