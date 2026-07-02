import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginSlide } from './entities/login-slide.entity';
import { CreateLoginSlideDto, UpdateLoginSlideDto } from './dto/create-login-slide.dto';

@Injectable()
export class LoginSlidesService implements OnModuleInit {
  constructor(
    @InjectRepository(LoginSlide)
    private readonly loginSlideRepository: Repository<LoginSlide>,
  ) {}

  async onModuleInit() {
    const count = await this.loginSlideRepository.count();
    if (count === 0) {
      const defaultSlides = [
        {
          title: 'Secure Ledger Records',
          description: 'Access, verify, and track authentic land deeds and ledger khatians with cryptographically secured records.',
          icon: 'ShieldCheck',
          color: 'from-emerald-500 to-teal-600',
          badge: 'Security Verified',
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1600&auto=format&fit=crop',
          isActive: true,
        },
        {
          title: 'Smart Mutation (Namjari)',
          description: 'Submit mutation applications online, track progress in real-time, and get automatic digital approvals.',
          icon: 'Layers',
          color: 'from-teal-500 to-cyan-600',
          badge: 'Digital Automation',
          image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop',
          isActive: true,
        },
        {
          title: 'GIS & Digital Mapping',
          description: 'Interact with advanced georeferenced maps, check plots, zoning data, and land boundaries instantly.',
          icon: 'Map',
          color: 'from-emerald-600 to-emerald-800',
          badge: 'GIS Integrated',
          image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=1600&auto=format&fit=crop',
          isActive: true,
        },
      ];
      await this.loginSlideRepository.save(defaultSlides);
      console.log('Seeded default login slides successfully.');
    }
  }

  async create(createLoginSlideDto: CreateLoginSlideDto): Promise<LoginSlide> {
    const slide = this.loginSlideRepository.create(createLoginSlideDto);
    return this.loginSlideRepository.save(slide);
  }

  async findAll(onlyActive = true): Promise<LoginSlide[]> {
    if (onlyActive) {
      return this.loginSlideRepository.find({ where: { isActive: true }, order: { id: 'ASC' } });
    }
    return this.loginSlideRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<LoginSlide> {
    const slide = await this.loginSlideRepository.findOne({ where: { id } });
    if (!slide) {
      throw new NotFoundException(`Login slide with ID ${id} not found`);
    }
    return slide;
  }

  async update(id: number, updateLoginSlideDto: UpdateLoginSlideDto): Promise<LoginSlide> {
    const slide = await this.findOne(id);
    Object.assign(slide, updateLoginSlideDto);
    return this.loginSlideRepository.save(slide);
  }

  async remove(id: number): Promise<void> {
    const slide = await this.findOne(id);
    await this.loginSlideRepository.remove(slide);
  }
}
