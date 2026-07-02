import { Injectable, OnModuleInit, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto, UpdatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async onModuleInit() {
    const count = await this.promotionRepository.count();
    if (count === 0) {
      const defaultPromotions = [
        {
          title: 'Monsoon Land Registry Special',
          description: 'Get 20% discount on official land document verification services.',
          code: 'MONSOON20',
          discountPercentage: 20,
          bannerUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=800&auto=format&fit=crop',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          isActive: true,
        },
        {
          title: 'Namjari (Mutation) Flat Discount',
          description: 'Flat 15% discount on all mutation applications filed online.',
          code: 'MUTATION15',
          discountPercentage: 15,
          bannerUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
          startDate: new Date(),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
          isActive: true,
        },
      ];
      await this.promotionRepository.save(defaultPromotions);
      console.log('Seeded default promotions successfully.');
    }
  }

  async create(createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    // Check if code already exists (codes are case-insensitive and stored uppercase)
    const normalizedCode = createPromotionDto.code.toUpperCase();
    const existing = await this.promotionRepository.findOne({ where: { code: normalizedCode } });
    if (existing) {
      throw new BadRequestException(`Promotion with code ${createPromotionDto.code} already exists`);
    }

    const promo = this.promotionRepository.create({
      ...createPromotionDto,
      code: normalizedCode,
      startDate: createPromotionDto.startDate ? new Date(createPromotionDto.startDate) : null,
      endDate: createPromotionDto.endDate ? new Date(createPromotionDto.endDate) : null,
    });
    return this.promotionRepository.save(promo);
  }

  async findAll(onlyActive = true): Promise<Promotion[]> {
    if (onlyActive) {
      return this.promotionRepository.find({ where: { isActive: true }, order: { id: 'ASC' } });
    }
    return this.promotionRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Promotion> {
    const promo = await this.promotionRepository.findOne({ where: { id } });
    if (!promo) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }
    return promo;
  }

  async findByCode(code: string): Promise<Promotion> {
    const promo = await this.promotionRepository.findOne({ where: { code: code.toUpperCase(), isActive: true } });
    if (!promo) {
      throw new NotFoundException(`Active promotion with code ${code} not found`);
    }
    return promo;
  }

  async update(id: number, updatePromotionDto: UpdatePromotionDto): Promise<Promotion> {
    const promo = await this.findOne(id);
    
    if (updatePromotionDto.code) {
      const normalizedCode = updatePromotionDto.code.toUpperCase();
      const existing = await this.promotionRepository.findOne({ where: { code: normalizedCode } });
      if (existing && existing.id !== id) {
        throw new BadRequestException(`Promotion with code ${updatePromotionDto.code} already exists`);
      }
      promo.code = normalizedCode;
    }

    if (updatePromotionDto.title !== undefined) promo.title = updatePromotionDto.title;
    if (updatePromotionDto.description !== undefined) promo.description = updatePromotionDto.description;
    if (updatePromotionDto.discountPercentage !== undefined) promo.discountPercentage = updatePromotionDto.discountPercentage;
    if (updatePromotionDto.bannerUrl !== undefined) promo.bannerUrl = updatePromotionDto.bannerUrl;
    if (updatePromotionDto.isActive !== undefined) promo.isActive = updatePromotionDto.isActive;
    
    if (updatePromotionDto.startDate !== undefined) {
      promo.startDate = updatePromotionDto.startDate ? new Date(updatePromotionDto.startDate) : null;
    }
    if (updatePromotionDto.endDate !== undefined) {
      promo.endDate = updatePromotionDto.endDate ? new Date(updatePromotionDto.endDate) : null;
    }

    return this.promotionRepository.save(promo);
  }

  async remove(id: number): Promise<void> {
    const promo = await this.findOne(id);
    await this.promotionRepository.remove(promo);
  }
}
