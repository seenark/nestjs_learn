import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'Users' })
@Unique('uqusername', ['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  /*   CMDEV
  async verifyPassword(password) {
    const hashPassword = await bcrypt.hashSync(password,this.salt)
    return this.password === hashPassword
  } */
}
