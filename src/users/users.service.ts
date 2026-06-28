import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

export interface FindAllUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isBanned?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') { // unique violation code in Postgres
        throw new ConflictException('Email or NID already exists');
      }
      throw error;
    }
  }

  async findAll(query: FindAllUsersQuery = {}) {
    const { page = 1, limit = 10, search, role, isBanned } = query;
    const skip = (page - 1) * limit;

    const qb = this.usersRepository.createQueryBuilder('user');

    if (search) {
      qb.andWhere('(user.name ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)', { search: `%${search}%` });
    }

    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    if (isBanned !== undefined) {
      qb.andWhere('user.isBanned = :isBanned', { isBanned });
    }

    qb.skip(skip).take(limit);
    qb.orderBy('user.createdAt', 'DESC');

    const [users, total] = await qb.getManyAndCount();

    return {
      data: users,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { resetPasswordToken: token } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    Object.assign(user, updateUserDto);
    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async ban(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isBanned = true;
    return await this.usersRepository.save(user);
  }

  async unban(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isBanned = false;
    return await this.usersRepository.save(user);
  }
}
