import { PartialType } from '@nestjs/swagger';
import { CreateLanddocDto } from './create-landdoc.dto';

export class UpdateLanddocDto extends PartialType(CreateLanddocDto) {}
