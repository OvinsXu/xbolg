import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
//import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    comment: '用户编号',
  })
  public id: number;

  @Column({
    comment: '用户名',
    type: 'varchar',
    length: 24,
    unique: true,
    nullable: false,
  })
  username: string;

  //@Exclude() //序列化,发送给客户端时,不发送密码
  @Column({
    comment: '密码',
    type: 'char',
    length: 64,
    nullable: false,
  })
  password: string;

  //@Exclude()
  @Column({
    comment: '密码盐',
    type: 'char',
    length: 32,
    nullable: false,
  })
  salt: string;

  @Column({
    comment: '用户昵称',
    type: 'varchar',
    length: 24,
    default: 'user',
  })
  nickname: string;

  @Column({
    comment: '用户状态', //正常/封禁/...  OK/NO...
    type: 'char',
    length: 8,
    default: 'OK',
  })
  status: string;

  @Column({
    comment: '用户角色', //root/admin/user
    type: 'char',
    length: 8,
    default: 'user',
  })
  role: string;

  @Column({
    comment: '邮箱',
    type: 'varchar',
    length: 64,
    nullable: true,
  })
  email: string;

  @Column({
    comment: '手机号码',
    type: 'char',
    length: 16,
    nullable: true,
  })
  phone: string;

  /**
   * address
   * register_time
   * register_ip
   * login_time
   * login_ip
   * 如果支持第三方登录可新建user_auth表:id,access_token,access_expire等
   */

  @CreateDateColumn()
  public createdAt: Date;

  //@Exclude()
  @UpdateDateColumn()
  public updatedAt: Date;

  // constructor(partial: Partial<User>) {
  //     Object.assign(this, partial);
  // }
}
