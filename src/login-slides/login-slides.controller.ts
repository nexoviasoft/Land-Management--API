import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { LoginSlidesService } from './login-slides.service';
import { CreateLoginSlideDto, UpdateLoginSlideDto } from './dto/create-login-slide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('login-slides')
export class LoginSlidesController {
  constructor(private readonly loginSlidesService: LoginSlidesService) {}

  @Get()
  async findAll() {
    const slides = await this.loginSlidesService.findAll(true);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login slides retrieved successfully',
      data: slides,
    };
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllAdmin() {
    const slides = await this.loginSlidesService.findAll(false);
    return {
      statusCode: HttpStatus.OK,
      message: 'All login slides retrieved successfully',
      data: slides,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const slide = await this.loginSlidesService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login slide retrieved successfully',
      data: slide,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createLoginSlideDto: CreateLoginSlideDto) {
    const slide = await this.loginSlidesService.create(createLoginSlideDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Login slide created successfully',
      data: slide,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() updateLoginSlideDto: UpdateLoginSlideDto) {
    const slide = await this.loginSlidesService.update(+id, updateLoginSlideDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login slide updated successfully',
      data: slide,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    await this.loginSlidesService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login slide deleted successfully',
    };
  }
}
