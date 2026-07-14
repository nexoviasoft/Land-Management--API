import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

export enum LandDocStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('land_docs')
export class LandDoc {
    @PrimaryGeneratedColumn()
    id: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ type: 'jsonb', nullable: true })
    location: {
        division: string;
        district: string;
        upazila: string;
        mouza: string;
    };

    @Column({ type: 'jsonb', name: 'land_details' })
    landDetails: {
        khatianNo: string;
        dagNo: string;
        kharijCaseNo: string;
        landType: string;
    };

    @Column({ type: 'jsonb' })
    documents: {
        khatianCopyUrl: string;
        kharijCopyUrl: string;
        otherRecord: { name: string; url: string }[];
    };

    @CreateDateColumn({ type: 'timestamp', name: 'uploaded_at' })
    uploadedAt: Date;

    @Column({
        type: 'enum',
        enum: LandDocStatus,
        default: LandDocStatus.PENDING
    })
    status: LandDocStatus;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
}
