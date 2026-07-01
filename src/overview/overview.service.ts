import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { LandDoc } from '../landdoc/entities/landdoc.entity';

@Injectable()
export class OverviewService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LandDoc)
    private readonly landDocRepository: Repository<LandDoc>,
  ) {}

  async getOverview() {
    const totalPartners = await this.userRepository.count({
      where: { role: UserRole.PARTNER }
    });

    const recentDocs = await this.landDocRepository.find({
      order: { uploadedAt: 'DESC' },
      take: 1
    });

    const recentActivity = recentDocs.length > 0 
      ? `New land document uploaded for ${recentDocs[0].location?.district || 'Unknown'}` 
      : 'No recent activity.';

    return {
      totalPartners,
      recentActivity
    };
  }
}
