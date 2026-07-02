import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'discount_percentage', type: 'integer' })
  discountPercentage: number;

  @Column({ name: 'banner_url' })
  bannerUrl: string;

  @Column({ name: 'start_date', type: 'timestamp', nullable: true })
  startDate: Date | null;

  @Column({ name: 'end_date', type: 'timestamp', nullable: true })
  endDate: Date | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
