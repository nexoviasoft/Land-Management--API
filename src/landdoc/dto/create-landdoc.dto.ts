import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsArray,
  IsUrl,
  IsOptional,
} from 'class-validator';

class LocationDto {
  @IsString()
  @IsNotEmpty()
  division: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  upazila: string;

  @IsString()
  @IsNotEmpty()
  mouza: string;
}

class LandDetailsDto {
  @IsString()
  @IsNotEmpty()
  khatianNo: string;

  @IsString()
  @IsNotEmpty()
  dagNo: string;

  @IsString()
  @IsNotEmpty()
  kharijCaseNo: string;

  @IsString()
  @IsNotEmpty()
  landType: string;
}

class DocumentRecordDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}

class DocumentsDto {
  @IsUrl()
  @IsNotEmpty()
  khatianCopyUrl: string;

  @IsUrl()
  @IsNotEmpty()
  kharijCopyUrl: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DocumentRecordDto)
  @IsOptional()
  otherRecord?: DocumentRecordDto[];
}

export class CreateLanddocDto {

  @ValidateNested()
  @Type(() => LocationDto)
  @IsNotEmpty()
  location: LocationDto;

  @ValidateNested()
  @Type(() => LandDetailsDto)
  @IsNotEmpty()
  landDetails: LandDetailsDto;

  @ValidateNested()
  @Type(() => DocumentsDto)
  @IsNotEmpty()
  documents: DocumentsDto;
}

