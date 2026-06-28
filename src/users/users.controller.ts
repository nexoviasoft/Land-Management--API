import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode, UseInterceptors, UploadedFile, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Request } from 'express';
import * as fs from 'fs';
import { UsersService } from './users.service';
import type { FindAllUsersQuery } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload-picture')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/profiles';
        if (!fs.existsSync('./uploads')) {
          fs.mkdirSync('./uploads');
        }
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `profile-${uniqueSuffix}${ext}`);
      }
    })
  }))
  uploadProfilePicture(@UploadedFile() file: any, @Req() req: Request) {
    const f = file as Express.Multer.File;
    const fullUrl = `${req.protocol}://${req.get('Host')}/uploads/profiles/${f.filename}`;
    return {
      statusCode: HttpStatus.OK,
      message: 'Profile picture uploaded successfully',
      data: {
        url: fullUrl,
        filename: f.filename,
      }
    };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      data: user,
    };
  }

  @Get()
  async findAll(@Query() query: FindAllUsersQuery) {
    const result = await this.usersService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Users retrieved successfully',
      data: result.data,
      meta: result.meta,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User found',
      data: user,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: user,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    };
  }

  @Patch(':id/ban')
  async banUser(@Param('id') id: string) {
    const user = await this.usersService.ban(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been banned successfully',
      data: user,
    };
  }

  @Patch(':id/unban')
  async unbanUser(@Param('id') id: string) {
    const user = await this.usersService.unban(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'User has been unbanned successfully',
      data: user,
    };
  }
}
