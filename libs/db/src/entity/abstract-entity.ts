import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ select: false })
  created!: Date;

  @Index()
  @UpdateDateColumn({ select: true })
  updated?: Date;

  @Index()
  @DeleteDateColumn({ select: false })
  deleted?: Date;
}
