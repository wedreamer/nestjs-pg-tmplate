import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract-entity';

export type Permission = string;

@Entity()
export class Role extends AbstractEntity {
  /**
   * 角色名
   */
  @Column()
  // @Prop({ required: true, unique: true })
  public name!: string;

  /**
   * 描述
   */
  @Column({ nullable: true })
  public describe?: string;

  /**
   * 层级
   */
  @Column()
  public tiers!: number;

  /**
   * 权限
   */
  @Column({ type: 'text', array: true })
  public permissions!: Permission[];

  /**
   * 启用
   */
  @Column({ default: true })
  public enable!: boolean;
}
