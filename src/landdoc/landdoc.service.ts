import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLanddocDto } from './dto/create-landdoc.dto';
import { UpdateLanddocDto } from './dto/update-landdoc.dto';
import { LandDoc } from './entities/landdoc.entity';
import { UserRole } from '../users/entities/user.entity';

export interface UserPayload {
  id: string;
  email: string;
  role: string;
}

export interface FindAllLanddocsQuery {
  page?: number;
  limit?: number;
  search?: string;
  division?: string;
  district?: string;
}

@Injectable()
export class LanddocService {
  constructor(
    @InjectRepository(LandDoc)
    private readonly landDocRepository: Repository<LandDoc>,
  ) {}

  async create(createLanddocDto: CreateLanddocDto, user: UserPayload): Promise<LandDoc> {
    const landDoc = this.landDocRepository.create({
      ...createLanddocDto,
      userId: user.id, // enforce that the creator is the authenticated user
    });
    return await this.landDocRepository.save(landDoc);
  }

  async findAll(user: UserPayload, query: FindAllLanddocsQuery = {}) {
    const { page = 1, limit = 10, search, division, district } = query;
    const skip = (page - 1) * limit;

    const qb = this.landDocRepository.createQueryBuilder('landDoc');

    // Enforce ownership for non-admin users
    if (user.role !== UserRole.ADMIN) {
      qb.andWhere('landDoc.userId = :userId', { userId: user.id });
    }

    if (search) {
      qb.andWhere(
        "(landDoc.location->>'district' ILIKE :search OR landDoc.location->>'upazila' ILIKE :search OR landDoc.location->>'mouza' ILIKE :search OR landDoc.landDetails->>'khatianNo' ILIKE :search OR landDoc.landDetails->>'dagNo' ILIKE :search)",
        { search: `%${search}%` }
      );
    }

    if (division) {
      qb.andWhere("landDoc.location->>'division' = :division", { division });
    }

    if (district) {
      qb.andWhere("landDoc.location->>'district' = :district", { district });
    }

    qb.skip(skip).take(limit);
    qb.orderBy('landDoc.uploadedAt', 'DESC');

    const [landDocs, total] = await qb.getManyAndCount();

    return {
      data: landDocs,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, user: UserPayload): Promise<LandDoc> {
    const landDoc = await this.landDocRepository.findOne({ where: { id } });
    if (!landDoc) {
      throw new NotFoundException(`LandDoc with ID ${id} not found`);
    }

    if (user.role !== UserRole.ADMIN && landDoc.userId !== user.id) {
      throw new ForbiddenException('You do not have permission to access this document');
    }

    return landDoc;
  }

  async update(id: string, updateLanddocDto: UpdateLanddocDto, user: UserPayload): Promise<LandDoc> {
    const landDoc = await this.findOne(id, user);
    Object.assign(landDoc, updateLanddocDto);
    return await this.landDocRepository.save(landDoc);
  }

  async remove(id: string, user: UserPayload): Promise<void> {
    const landDoc = await this.findOne(id, user);
    await this.landDocRepository.remove(landDoc);
  }
}
