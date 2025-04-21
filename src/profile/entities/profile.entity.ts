import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('profiles')
export class Profile {
  @PrimaryColumn()
  uid: string;

  @Column({ nullable: true })
  name?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: 'simple-json', nullable: true })
  additionalInfo?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
