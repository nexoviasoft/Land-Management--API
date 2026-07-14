import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'recipient_id' })
  recipientId: string;

  @Column()
  message: string;

  @Column({ default: false, name: 'is_read' })
  isRead: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}
