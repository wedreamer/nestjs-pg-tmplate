import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Permission, Role } from './role.entity';
import { AbstractEntity } from './abstract-entity';

// @Index('id_org', ['id', 'orgId'], { unique: true })
@Entity()
export class User extends AbstractEntity {
  /**
   * 用户名
   */
  @Column()
  // @Prop({ required: true, unique: true })
  public name!: string;

  /**
   * 昵称
   */
  @Column({ nullable: true })
  public nickName?: string;

  /**
   * 头像
   */
  @Column({ nullable: true })
  public avatar?: string;

  /**
   * 邮箱
   */
  @Column()
  // @Prop({ required: true, unique: true })
  public email!: string;

  /**
   * 电话号码
   */
  @Column()
  // @Prop({ required: true, unique: true })
  public phoneNum!: string;

  /**
   * 密码
   */
  @Column({ select: false })
  public password!: string;

  /**
   * 启用
   */
  @Column({ default: true })
  public enable!: boolean;

  /**
   * 角色
   */
  @ManyToMany(() => Role)
  @JoinTable()
  public roles!: Role[];

  /**
   * 权限
   */
  @Column('text', { array: true, default: [] })
  public permissions!: Permission[];

  /**
   * root 用户
   */
  @Column({ select: false })
  public initRoot!: boolean;
}
