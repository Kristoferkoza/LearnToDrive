import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../users/entities/user.entity';

@Entity({ name: 'refresh_token_ids' })
export class RefreshTokenId {
  @PrimaryGeneratedColumn('uuid', { name: 'token_id' })
  tokenId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.refreshTokenId)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @Column({ name: 'expires_at' })
  expiresAt: Date;
}