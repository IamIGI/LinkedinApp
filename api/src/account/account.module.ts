import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userExperienceEntity } from './models/userExperience.entity';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';

@Module({
  imports: [TypeOrmModule.forFeature([userExperienceEntity])],
  providers: [JwtGuard, AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
