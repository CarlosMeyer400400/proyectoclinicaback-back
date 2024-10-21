import { PartialType } from '@nestjs/mapped-types';
import { CreateRecuperarPassDto } from './create-recuperar-pass.dto';

export class UpdateRecuperarPassDto extends PartialType(CreateRecuperarPassDto) {}
