import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, Max, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  discountPercentage: number;

  @IsString()
  @IsNotEmpty()
  bannerUrl: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdatePromotionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  discountPercentage?: number;

  @IsString()
  @IsOptional()
  bannerUrl?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
