import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateLoginSlideDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  icon: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  badge: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateLoginSlideDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsString()
  @IsOptional()
  badge?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
