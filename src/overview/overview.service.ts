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

  async getSuperAdminOverview() {
    const totalPartners = await this.userRepository.count({
      where: { role: UserRole.PARTNER }
    });
    
    const totalAdmins = await this.userRepository.count({
      where: { role: UserRole.ADMIN }
    });

    const totalLandDocs = await this.landDocRepository.count();

    const pendingApprovals = await this.landDocRepository.count({
      where: { status: 'pending' as any } // Using any because enum isn't imported here, or I can import it
    });

    const recentDocs = await this.landDocRepository.find({
      order: { uploadedAt: 'DESC' },
      take: 5
    });

    const recentActivity = recentDocs.length > 0 
      ? `New land document uploaded for ${recentDocs[0].location?.district || 'Unknown'}` 
      : 'No recent activity.';

    return {
      totalPartners,
      totalAdmins,
      totalLandDocs,
      pendingApprovals,
      recentDocs,
      recentActivity
    };
  }

  async getUserOverview(userId: string) {
    const totalLandDocs = await this.landDocRepository.count({
      where: { userId }
    });

    const pendingApprovals = await this.landDocRepository.count({
      where: { userId, status: 'pending' as any }
    });

    const recentDocs = await this.landDocRepository.find({
      where: { userId },
      order: { uploadedAt: 'DESC' },
      take: 5
    });

    const recentActivity = recentDocs.length > 0 
      ? `You recently uploaded a document for ${recentDocs[0].location?.district || 'Unknown'}` 
      : 'No recent activity.';

    return {
      totalLandDocs,
      pendingApprovals,
      recentDocs,
      recentActivity
    };
  }

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
