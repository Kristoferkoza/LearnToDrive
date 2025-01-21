import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { RefreshTokenId } from '../entities/refresh-token-id.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RefreshTokenIdsService {
  constructor(
    @InjectRepository(RefreshTokenId) private readonly refreshTokenIdsRepository: Repository<RefreshTokenId>,
  ) {}

  async create(userId: string, expiresAt: Date): Promise<RefreshTokenId> {
    const existingToken = await this.refreshTokenIdsRepository.findOneBy({ userId });
    if (existingToken) {
      await this.refreshTokenIdsRepository.delete({ userId });
    }

    const refreshTokenId = this.refreshTokenIdsRepository.create({
      userId,
      expiresAt,
    });

    return await this.refreshTokenIdsRepository.save(refreshTokenId);
  }

  async validate(userId: string, tokenId: string): Promise<boolean> {
    if (!tokenId) {
      throw new UnauthorizedException();
    }
    const refreshToken = await this.refreshTokenIdsRepository.findOneBy({ userId });

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    return refreshToken.tokenId === tokenId;
  }

  async delete(userId: string): Promise<void> {
    await this.refreshTokenIdsRepository.delete({ userId });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpired(): Promise<void> {
    const now = new Date();
    await this.refreshTokenIdsRepository.delete({ expiresAt: LessThan(now) });
  }
}