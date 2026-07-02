import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/create-promotion.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  async findAll() {
    const promotions = await this.promotionsService.findAll(true);
    return {
      statusCode: HttpStatus.OK,
      message: 'Promotions retrieved successfully',
      data: promotions,
    };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllAdmin() {
    const promotions = await this.promotionsService.findAll(false);
    return {
      statusCode: HttpStatus.OK,
      message: 'All promotions retrieved successfully',
      data: promotions,
    };
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    const promotion = await this.promotionsService.findByCode(code);
    return {
      statusCode: HttpStatus.OK,
      message: 'Promotion retrieved successfully by code',
      data: promotion,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const promotion = await this.promotionsService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Promotion retrieved successfully',
      data: promotion,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createPromotionDto: CreatePromotionDto) {
    const promotion = await this.promotionsService.create(createPromotionDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Promotion created successfully',
      data: promotion,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    const promotion = await this.promotionsService.update(+id, updatePromotionDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Promotion updated successfully',
      data: promotion,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.promotionsService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Promotion deleted successfully',
    };
  }
}
