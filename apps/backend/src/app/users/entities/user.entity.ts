import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshTokenId } from '../../iam/authentication/entities/refresh-token-id.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  age: number;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => RefreshTokenId, (refreshToken) => refreshToken.user)
  refreshTokenId: RefreshTokenId;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
