import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req, HttpCode, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { LanddocService } from './landdoc.service';
import type { FindAllLanddocsQuery } from './landdoc.service';
import { CreateLanddocDto } from './dto/create-landdoc.dto';
import { UpdateLanddocDto } from './dto/update-landdoc.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { UserPayload } from './landdoc.service';

interface AuthenticatedRequest extends Request {
  user: UserPayload;
}

@UseGuards(JwtAuthGuard)
@Controller('landdoc')
export class LanddocController {
  constructor(private readonly landdocService: LanddocService) {}

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      }
    })
  }))
  uploadFile(@UploadedFile() file: any, @Req() req: AuthenticatedRequest) {
    const f = file as Express.Multer.File;
    const fullUrl = `${req.protocol}://${req.get('Host')}/uploads/${f.filename}`;
    return {
      statusCode: HttpStatus.OK,
      message: 'File uploaded successfully',
      data: { url: fullUrl }
    };
  }

  @Post()
  async create(@Body() createLanddocDto: CreateLanddocDto, @Req() req: AuthenticatedRequest) {
    const landDoc = await this.landdocService.create(createLanddocDto, req.user);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Land document created successfully',
      data: landDoc,
    };
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest, @Query() query: FindAllLanddocsQuery) {
    const result = await this.landdocService.findAll(req.user, query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Land documents retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const data = await this.landdocService.findOne(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Land document retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateLanddocDto: UpdateLanddocDto, @Req() req: AuthenticatedRequest) {
    const data = await this.landdocService.update(id, updateLanddocDto, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Land document updated successfully',
      data,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    await this.landdocService.remove(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Land document deleted successfully',
    };
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const data = await this.landdocService.approve(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Land document approved successfully',
      data,
    };
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.OK)
  async reject(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const data = await this.landdocService.reject(id, req.user);
    return {
      statusCode: HttpStatus.OK,
      message: 'Land document rejected successfully',
      data,
    };
  }
}
