import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('land_docs')
export class LandDoc {
    @PrimaryGeneratedColumn()
    id: string;

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
}
