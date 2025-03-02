import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({name: 'phone_number'})
  phoneNumber: string;

  @Column()
  age: number;

  @Column({ default: true })
  active: boolean;
}
