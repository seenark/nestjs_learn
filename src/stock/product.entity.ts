import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'Products' })
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  price: number;
  @Column()
  stock: number;
  @Column({ default: 'no-image.png' })
  imageName: string;
  @CreateDateColumn()
  created: Date;

  @UpdateDateColumn()
  updated: Date;
}
