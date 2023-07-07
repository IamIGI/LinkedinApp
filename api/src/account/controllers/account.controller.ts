import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserExperience } from '../models/userExperience.model';
import { AccountService } from '../services/account.service';
import { UpdateResult } from 'typeorm';

@UseGuards(JwtGuard)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('experience')
  userExperience(@Request() req): Observable<UserExperience[]> {
    return this.accountService.getUserExperience(req.user);
  }

  @Post('experience')
  addUserExperience(
    @Request() req,
    @Body() experience: UserExperience,
  ): Observable<UserExperience> {
    return this.accountService.addUserExperience(experience, req.user);
  }

  @Patch('experience')
  updateUserExperience(
    @Body() experience: UserExperience,
  ): Observable<UpdateResult> {
    return this.accountService.updateUserExperience(experience);
  }

  @Delete('experience')
  removeUserExperience(@Query('experienceId') experienceId: number = 0) {
    return this.accountService.deleteUserExperience(experienceId);
  }
}
